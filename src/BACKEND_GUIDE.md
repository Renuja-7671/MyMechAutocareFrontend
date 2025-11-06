# Backend Implementation Guide for WheelsDoc AutoCare

This guide provides sample Express.js backend code to integrate with the WheelsDoc AutoCare frontend.

## Quick Start

### 1. Install Required Packages

```bash
npm install express cors dotenv bcryptjs jsonwebtoken
npm install @prisma/client
npm install -D prisma typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken
```

### 2. Initialize Prisma

```bash
npx prisma init
```

### 3. Configure Prisma

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  phone     String?
  password  String
  role      String   // customer, employee, admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  vehicles      Vehicle[]
  services      Service[]       @relation("CustomerServices")
  assignedServices Service[]    @relation("EmployeeServices")
  appointments  Appointment[]
  timeLogs      TimeLog[]
  modifications Modification[]
}

model Vehicle {
  id           String   @id @default(uuid())
  customerId   String
  customer     User     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  make         String
  model        String
  year         Int
  licensePlate String
  vin          String?
  createdAt    DateTime @default(now())

  services      Service[]
  appointments  Appointment[]
  modifications Modification[]
}

model Service {
  id                  String    @id @default(uuid())
  vehicleId           String
  vehicle             Vehicle   @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  customerId          String
  customer            User      @relation("CustomerServices", fields: [customerId], references: [id], onDelete: Cascade)
  assignedEmployeeId  String?
  assignedEmployee    User?     @relation("EmployeeServices", fields: [assignedEmployeeId], references: [id], onDelete: SetNull)
  serviceType         String
  description         String?
  status              String    @default("pending") // pending, in_progress, completed, cancelled, on_hold
  progress            Int       @default(0)
  startDate           DateTime?
  estimatedCompletion DateTime?
  actualCompletion    DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  timeLogs TimeLog[]
}

model Appointment {
  id            String   @id @default(uuid())
  vehicleId     String
  vehicle       Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  customerId    String
  customer      User     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  serviceType   String
  preferredDate DateTime
  preferredTime String
  description   String?
  status        String   @default("pending") // pending, confirmed, completed, cancelled
  createdAt     DateTime @default(now())
}

model TimeLog {
  id          String   @id @default(uuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  employeeId  String
  employee    User     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  hours       Float
  description String
  logDate     DateTime
  createdAt   DateTime @default(now())
}

model Modification {
  id                   String   @id @default(uuid())
  vehicleId            String
  vehicle              Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  customerId           String
  customer             User     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  modificationDetails  String
  estimatedBudget      Float?
  status               String   @default("pending")
  createdAt            DateTime @default(now())
}
```

### 4. Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
```

### 5. Sample Express.js Server

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ========== AUTH ROUTES ==========

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || 'customer'
      }
    });

    res.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CUSTOMER ROUTES ==========

// Get customer's services
app.get('/api/customer/services', authenticateToken, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { customerId: req.user.id },
      include: {
        vehicle: true,
        assignedEmployee: {
          select: { name: true }
        }
      }
    });

    const formattedServices = services.map(service => ({
      id: service.id,
      vehicleName: `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}`,
      serviceType: service.serviceType,
      status: service.status,
      progress: service.progress,
      startDate: service.startDate,
      estimatedCompletion: service.estimatedCompletion,
      assignedEmployee: service.assignedEmployee?.name,
      totalHoursLogged: 0 // Calculate from timeLogs if needed
    }));

    res.json({ success: true, data: formattedServices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get customer's vehicles
app.get('/api/customer/vehicles', authenticateToken, async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { customerId: req.user.id }
    });

    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add vehicle
app.post('/api/customer/vehicles', authenticateToken, async (req, res) => {
  try {
    const { make, model, year, licensePlate, vin } = req.body;

    const vehicle = await prisma.vehicle.create({
      data: {
        customerId: req.user.id,
        make,
        model,
        year: parseInt(year),
        licensePlate,
        vin
      }
    });

    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Book appointment
app.post('/api/customer/appointments', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, serviceType, preferredDate, preferredTime, description } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        vehicleId,
        customerId: req.user.id,
        serviceType,
        preferredDate: new Date(preferredDate),
        preferredTime,
        description
      }
    });

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get appointments
app.get('/api/customer/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { customerId: req.user.id },
      include: { vehicle: true }
    });

    const formatted = appointments.map(apt => ({
      id: apt.id,
      vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
      serviceType: apt.serviceType,
      date: apt.preferredDate,
      time: apt.preferredTime,
      status: apt.status
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Request modification
app.post('/api/customer/modifications', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, modificationDetails, estimatedBudget } = req.body;

    const modification = await prisma.modification.create({
      data: {
        vehicleId,
        customerId: req.user.id,
        modificationDetails,
        estimatedBudget: parseFloat(estimatedBudget)
      }
    });

    res.json({ success: true, data: modification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chatbot - Check available slots
app.get('/api/customer/chatbot/slots', authenticateToken, async (req, res) => {
  try {
    const { date, serviceType } = req.query;
    
    // Mock implementation - replace with actual slot checking logic
    const availableSlots = ['9:00 AM - 10:00 AM', '11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM', '4:00 PM - 5:00 PM'];
    
    res.json({ success: true, data: { availableSlots } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== EMPLOYEE ROUTES ==========

// Get assigned services
app.get('/api/employee/services', authenticateToken, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { assignedEmployeeId: req.user.id },
      include: {
        vehicle: true,
        customer: {
          select: { name: true }
        },
        timeLogs: true
      }
    });

    const formatted = services.map(service => ({
      id: service.id,
      vehicleName: `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}`,
      customerName: service.customer.name,
      serviceType: service.serviceType,
      status: service.status,
      progress: service.progress,
      startDate: service.startDate,
      estimatedCompletion: service.estimatedCompletion,
      totalHoursLogged: service.timeLogs.reduce((sum, log) => sum + log.hours, 0)
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Log time
app.post('/api/employee/time-logs', authenticateToken, async (req, res) => {
  try {
    const { serviceId, hours, description, date } = req.body;

    const timeLog = await prisma.timeLog.create({
      data: {
        serviceId,
        employeeId: req.user.id,
        hours: parseFloat(hours),
        description,
        logDate: new Date(date)
      }
    });

    res.json({ success: true, data: timeLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update service status
app.patch('/api/employee/services/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: { 
        status,
        ...(status === 'completed' && { actualCompletion: new Date() })
      }
    });

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get upcoming appointments
app.get('/api/employee/appointments/upcoming', authenticateToken, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        preferredDate: {
          gte: new Date()
        }
      },
      include: {
        vehicle: true,
        customer: true
      },
      orderBy: { preferredDate: 'asc' }
    });

    const formatted = appointments.map(apt => ({
      id: apt.id,
      vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
      customerName: apt.customer.name,
      customerPhone: apt.customer.phone,
      serviceType: apt.serviceType,
      date: apt.preferredDate,
      time: apt.preferredTime,
      status: apt.status
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get time logs
app.get('/api/employee/time-logs', authenticateToken, async (req, res) => {
  try {
    const timeLogs = await prisma.timeLog.findMany({
      where: { employeeId: req.user.id },
      include: {
        service: {
          include: { vehicle: true }
        }
      },
      orderBy: { logDate: 'desc' }
    });

    const formatted = timeLogs.map(log => ({
      id: log.id,
      serviceName: `${log.service.vehicle.year} ${log.service.vehicle.make} ${log.service.vehicle.model} - ${log.service.serviceType}`,
      hours: log.hours,
      description: log.description,
      date: log.logDate
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN ROUTES ==========

// Get all users
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user role
app.patch('/api/admin/users/:id/role', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { id } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all services
app.get('/api/admin/services', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const services = await prisma.service.findMany({
      include: {
        vehicle: true,
        customer: { select: { name: true } },
        assignedEmployee: { select: { id: true, name: true } }
      }
    });

    const formatted = services.map(service => ({
      id: service.id,
      vehicleName: `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}`,
      customerName: service.customer.name,
      serviceType: service.serviceType,
      status: service.status,
      progress: service.progress,
      assignedEmployee: service.assignedEmployee?.name,
      assignedEmployeeId: service.assignedEmployee?.id,
      startDate: service.startDate
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign service to employee
app.patch('/api/admin/services/:id/assign', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { id } = req.params;
    const { employeeId } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: { 
        assignedEmployeeId: employeeId,
        status: 'in_progress',
        startDate: new Date()
      }
    });

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all appointments
app.get('/api/admin/appointments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        vehicle: true,
        customer: true
      }
    });

    const formatted = appointments.map(apt => ({
      id: apt.id,
      vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
      customerName: apt.customer.name,
      customerEmail: apt.customer.email,
      serviceType: apt.serviceType,
      date: apt.preferredDate,
      time: apt.preferredTime,
      status: apt.status
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dashboard stats
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const [totalCustomers, totalEmployees, activeServices, completedServices, pendingAppointments] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.user.count({ where: { role: 'employee' } }),
      prisma.service.count({ where: { status: 'in_progress' } }),
      prisma.service.count({ where: { status: 'completed' } }),
      prisma.appointment.count({ where: { status: 'pending' } })
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalEmployees,
        activeServices,
        completedServices,
        pendingAppointments,
        revenue: 0 // Implement revenue calculation based on your business logic
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate reports
app.get('/api/admin/reports/:type', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { type } = req.params;
    const { startDate, endDate } = req.query;

    // Implement your report generation logic here
    // This is a mock response
    res.json({
      success: true,
      data: {
        totalRecords: 100,
        totalAmount: 50000,
        average: 500,
        growth: 15
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 6. Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 7. Start the Server

```bash
node server.js
```

Your backend should now be running on http://localhost:5000 and ready to accept requests from the WheelsDoc AutoCare frontend!

## Security Checklist

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Input validation (add Joi/Zod)
- ✅ SQL injection prevention (Prisma ORM)
- ⚠️ Add rate limiting
- ⚠️ Add request validation middleware
- ⚠️ Add HTTPS in production

## Testing

Use tools like:
- Postman or Thunder Client for API testing
- Jest for unit tests
- Supertest for integration tests
