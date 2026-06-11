import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to apps/api/.env');
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@erp.local' },
    update: {},
    create: {
      email: 'admin@erp.local',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  const company = await prisma.company.upsert({
    where: { slug: 'demo-corp' },
    update: {},
    create: {
      name: 'Demo Corp',
      slug: 'demo-corp',
      ownerId: admin.id,
      industry: 'Technology',
      size: '50-200',
      website: 'https://democorp.example.com',
      address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
      phone: '+1-555-0100',
    },
  });
  console.log('Company created:', company.name);

  await prisma.user.update({
    where: { id: admin.id },
    data: { companyId: company.id },
  });

  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@erp.local' },
    update: {},
    create: {
      email: 'staff@erp.local',
      password: staffPassword,
      firstName: 'Staff',
      lastName: 'Member',
      role: 'STAFF',
      companyId: company.id,
    },
  });
  console.log('Staff user created:', staff.email);

  const deptNames = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'];
  const departments = [];
  for (const name of deptNames) {
    const dept = await prisma.department.create({
      data: { name, companyId: company.id },
    });
    departments.push(dept);
  }
  console.log('Departments created:', deptNames.length);

  const employeeData = [
    { firstName: 'John', lastName: 'Smith', email: 'john@demo.com', position: 'Senior Engineer', salary: 120000, dept: 'Engineering' },
    { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@demo.com', position: 'Marketing Manager', salary: 95000, dept: 'Marketing' },
    { firstName: 'Mike', lastName: 'Brown', email: 'mike@demo.com', position: 'Sales Rep', salary: 80000, dept: 'Sales' },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily@demo.com', position: 'HR Coordinator', salary: 65000, dept: 'Human Resources' },
    { firstName: 'David', lastName: 'Wilson', email: 'david@demo.com', position: 'Accountant', salary: 75000, dept: 'Finance' },
    { firstName: 'Lisa', lastName: 'Anderson', email: 'lisa@demo.com', position: 'Operations Lead', salary: 90000, dept: 'Operations' },
    { firstName: 'James', lastName: 'Taylor', email: 'james@demo.com', position: 'Junior Developer', salary: 70000, dept: 'Engineering' },
    { firstName: 'Anna', lastName: 'Martin', email: 'anna@demo.com', position: 'Content Writer', salary: 55000, dept: 'Marketing' },
  ];

  for (const emp of employeeData) {
    const dept = departments.find(d => d.name === emp.dept);
    await prisma.employee.create({
      data: {
        ...emp,
        departmentId: dept!.id,
        companyId: company.id,
        hireDate: new Date('2024-01-15'),
      },
    });
  }
  console.log('Employees created:', employeeData.length);

  const contacts = [
    { firstName: 'Acme', lastName: 'Corp', email: 'info@acme.com', phone: '+1-555-0101', jobTitle: 'Client', source: 'Website' },
    { firstName: 'Bob', lastName: 'Miller', email: 'bob@globaltech.com', phone: '+1-555-0102', jobTitle: 'CTO', source: 'Referral' },
    { firstName: 'Carol', lastName: 'White', email: 'carol@innovate.io', phone: '+1-555-0103', jobTitle: 'CEO', source: 'LinkedIn' },
    { firstName: 'Dan', lastName: 'Lee', email: 'dan@startup.co', phone: '+1-555-0104', jobTitle: 'Founder', source: 'Conference' },
    { firstName: 'Eve', lastName: 'Garcia', email: 'eve@enterprise.com', phone: '+1-555-0105', jobTitle: 'VP Engineering', source: 'Referral' },
    { firstName: 'Frank', lastName: 'Chen', email: 'frank@techsolutions.com', phone: '+1-555-0106', jobTitle: 'Director', source: 'Website' },
    { firstName: 'Grace', lastName: 'Kim', email: 'grace@digital.co', phone: '+1-555-0107', jobTitle: 'Product Manager', source: 'Email' },
    { firstName: 'Henry', lastName: 'Patel', email: 'henry@webify.com', phone: '+1-555-0108', jobTitle: 'CEO', source: 'Conference' },
  ];

  const createdContacts = [];
  for (const c of contacts) {
    const contact = await prisma.contact.create({
      data: { ...c, companyId: company.id, ownerId: admin.id },
    });
    createdContacts.push(contact);
  }
  console.log('Contacts created:', createdContacts.length);

  const dealStages = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON'];
  const dealNames = [
    { title: 'Website Redesign', value: 25000, stage: 'NEGOTIATION', prob: 70 },
    { title: 'Mobile App Development', value: 80000, stage: 'PROPOSAL', prob: 50 },
    { title: 'Cloud Migration', value: 150000, stage: 'QUALIFIED', prob: 30 },
    { title: 'Consulting Services', value: 15000, stage: 'LEAD', prob: 15 },
    { title: 'Enterprise License', value: 50000, stage: 'CLOSED_WON', prob: 100 },
    { title: 'Data Analytics Platform', value: 95000, stage: 'NEGOTIATION', prob: 65 },
    { title: 'Security Audit', value: 20000, stage: 'QUALIFIED', prob: 40 },
    { title: 'Training Program', value: 12000, stage: 'LEAD', prob: 10 },
  ];

  for (let i = 0; i < dealNames.length; i++) {
    const d = dealNames[i];
    await prisma.deal.create({
      data: {
        title: d.title,
        value: d.value,
        stage: d.stage as any,
        probability: d.prob,
        companyId: company.id,
        ownerId: admin.id,
        contactId: createdContacts[i % createdContacts.length].id,
      },
    });
  }
  console.log('Deals created:', dealNames.length);

  const catNames = ['Electronics', 'Software', 'Services', 'Office Supplies'];
  const productData = [
    { name: 'Laptop Pro X1', sku: 'TECH-001', price: 2499, cost: 1800, stock: 45, minStock: 10, category: 'Electronics' },
    { name: 'Wireless Mouse', sku: 'TECH-002', price: 79, cost: 35, stock: 200, minStock: 50, category: 'Electronics' },
    { name: 'Mechanical Keyboard', sku: 'TECH-003', price: 149, cost: 75, stock: 120, minStock: 30, category: 'Electronics' },
    { name: 'ERP License - Basic', sku: 'SW-001', price: 999, cost: 200, stock: 999, minStock: 0, category: 'Software' },
    { name: 'ERP License - Enterprise', sku: 'SW-002', price: 4999, cost: 800, stock: 999, minStock: 0, category: 'Software' },
    { name: 'Cloud Storage (1TB)', sku: 'SV-001', price: 99, cost: 30, stock: 999, minStock: 0, category: 'Services' },
    { name: 'Consulting Hourly', sku: 'SV-002', price: 250, cost: 100, stock: 500, minStock: 0, category: 'Services' },
    { name: 'Office Desk', sku: 'OFF-001', price: 599, cost: 350, stock: 30, minStock: 10, category: 'Office Supplies' },
    { name: 'Ergonomic Chair', sku: 'OFF-002', price: 899, cost: 500, stock: 5, minStock: 10, category: 'Office Supplies' },
    { name: 'Monitor 27" 4K', sku: 'TECH-004', price: 699, cost: 450, stock: 8, minStock: 15, category: 'Electronics' },
  ];

  for (const p of productData) {
    await prisma.product.create({
      data: { ...p, companyId: company.id },
    });
  }
  console.log('Products created:', productData.length);

  const invoiceData = [
    { number: 'INV-2024-001', status: 'PAID', customer: 'Acme Corp', total: 4999, items: [{ desc: 'ERP License - Enterprise', qty: 1, price: 4999 }] },
    { number: 'INV-2024-002', status: 'SENT', customer: 'Global Tech', total: 2499, items: [{ desc: 'Laptop Pro X1', qty: 1, price: 2499 }] },
    { number: 'INV-2024-003', status: 'OVERDUE', customer: 'Innovate IO', total: 12950, items: [{ desc: 'Consulting (40h)', qty: 40, price: 250 }, { desc: 'Cloud Storage 1TB', qty: 5, price: 99 }] },
    { number: 'INV-2024-004', status: 'DRAFT', customer: 'Startup Co', total: 750, items: [{ desc: 'Wireless Mouse', qty: 5, price: 79 }, { desc: 'Mechanical Keyboard', qty: 2, price: 149 }] },
    { number: 'INV-2024-005', status: 'PAID', customer: 'Enterprise Inc', total: 15000, items: [{ desc: 'Consulting Services', qty: 60, price: 250 }] },
  ];

  for (const inv of invoiceData) {
    const subtotal = inv.items.reduce((s, i) => s + i.qty * i.price, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    await prisma.invoice.create({
      data: {
        number: inv.number,
        status: inv.status as any,
        customerName: inv.customer,
        subtotal,
        tax,
        total: subtotal + tax,
        companyId: company.id,
        ownerId: admin.id,
      },
    });
  }
  console.log('Invoices created:', invoiceData.length);

  const projects = [
    { name: 'Website Redesign', description: 'Complete overhaul of corporate website with modern stack', budget: 30000 },
    { name: 'Mobile App v2', description: 'Version 2 of our mobile application with new features', budget: 80000 },
    { name: 'Cloud Migration', description: 'Migrate on-premise infrastructure to AWS', budget: 150000 },
    { name: 'Internal Tools', description: 'Build internal dashboard and automation tools', budget: 25000 },
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: {
        name: p.name,
        description: p.description,
        budget: p.budget,
        status: 'active',
        companyId: company.id,
        ownerId: admin.id,
      },
    });
  }
  console.log('Projects created:', projects.length);

  const allProjects = await prisma.project.findMany({ where: { companyId: company.id } });
  const taskData = [
    { title: 'Design mockups', status: 'DONE', priority: 'HIGH', project: 'Website Redesign' },
    { title: 'Frontend implementation', status: 'IN_PROGRESS', priority: 'HIGH', project: 'Website Redesign' },
    { title: 'Backend API integration', status: 'TODO', priority: 'MEDIUM', project: 'Website Redesign' },
    { title: 'API design', status: 'DONE', priority: 'HIGH', project: 'Mobile App v2' },
    { title: 'User authentication', status: 'IN_PROGRESS', priority: 'HIGH', project: 'Mobile App v2' },
    { title: 'Push notifications', status: 'TODO', priority: 'MEDIUM', project: 'Mobile App v2' },
    { title: 'AWS infrastructure setup', status: 'IN_PROGRESS', priority: 'URGENT', project: 'Cloud Migration' },
    { title: 'Database migration', status: 'TODO', priority: 'HIGH', project: 'Cloud Migration' },
    { title: 'Dashboard UI', status: 'DONE', priority: 'MEDIUM', project: 'Internal Tools' },
    { title: 'Reporting module', status: 'TODO', priority: 'LOW', project: 'Internal Tools' },
  ];

  for (const t of taskData) {
    const project = allProjects.find(p => p.name === t.project);
    if (project) {
      await prisma.task.create({
        data: {
          title: t.title,
          status: t.status as any,
          priority: t.priority as any,
          projectId: project.id,
          assigneeId: admin.id,
          creatorId: admin.id,
        },
      });
    }
  }
  console.log('Tasks created:', taskData.length);

  const vendorData = [
    { name: 'TechSupply Global', email: 'orders@techsupply.com', phone: '+1-555-0201', rating: 4.8 },
    { name: 'Office Essentials Co', email: 'sales@officeess.com', phone: '+1-555-0202', rating: 4.5 },
    { name: 'CloudParts Inc', email: 'procurement@cloudparts.io', phone: '+1-555-0203', rating: 4.9 },
    { name: 'Pacific Logistics', email: 'ops@pacificlog.com', phone: '+1-555-0204', rating: 4.2 },
  ];
  const vendors = [];
  for (const v of vendorData) {
    const vendor = await prisma.vendor.create({ data: { ...v, companyId: company.id } });
    vendors.push(vendor);
  }
  console.log('Vendors created:', vendors.length);

  for (let i = 0; i < 5; i++) {
    await prisma.purchaseOrder.create({
      data: {
        number: `PO-2026-${String(i + 1).padStart(4, '0')}`,
        status: (['SENT', 'RECEIVED', 'DRAFT', 'SENT', 'RECEIVED'] as const)[i],
        total: [12500, 8400, 3200, 15600, 9800][i],
        vendorId: vendors[i % vendors.length].id,
        companyId: company.id,
        expectedAt: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('Purchase orders created: 5');

  const notificationData = [
    { title: 'Low stock alert', message: 'Wireless Mouse stock below reorder threshold (12 units remaining)', type: 'WARNING' as const },
    { title: 'Invoice paid', message: 'INV-2026-0042 marked as paid — $24,500 received', type: 'SUCCESS' as const },
    { title: 'AI forecast ready', message: 'Weekly demand forecast model retrained with MAPE 9.8%', type: 'INFO' as const },
    { title: 'PO approved', message: 'Purchase order PO-2026-0003 sent to TechSupply Global', type: 'INFO' as const },
    { title: 'Deal won', message: 'Enterprise License deal closed — $85,000 added to pipeline', type: 'SUCCESS' as const },
  ];
  for (const n of notificationData) {
    await prisma.notification.create({ data: { ...n, userId: admin.id } });
  }
  console.log('Notifications created:', notificationData.length);

  console.log('\n--- Seed Complete ---');
  console.log('Login: admin@erp.local / admin123');
  console.log('Login: staff@erp.local / staff123');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
