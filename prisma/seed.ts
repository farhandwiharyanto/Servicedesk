import { PrismaClient, PriorityType, StatusType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with high-fidelity Zoho ServiceDesk Plus data...');

  // 1. Roles & Permissions (Zoho standard roles)
  const adminRole = await prisma.role.upsert({
    where: { name: 'SDAdmin' },
    update: {},
    create: {
      name: 'SDAdmin',
      permissions: ['dashboard', 'requests', 'assets', 'admin', 'reports', 'problems', 'changes', 'projects', 'solutions', 'maintenance', 'cmdb', 'purchase', 'contracts'],
    },
  });

  const techRole = await prisma.role.upsert({
    where: { name: 'Technician' },
    update: {},
    create: {
      name: 'Technician',
      permissions: ['dashboard', 'requests', 'assets', 'problems', 'solutions'],
    },
  });

  const requesterRole = await prisma.role.upsert({
    where: { name: 'Requester' },
    update: {},
    create: {
      name: 'Requester',
      permissions: ['dashboard', 'requests', 'solutions'],
    },
  });

  // 2. Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@manageengine.com' },
    update: { roleId: adminRole.id },
    create: {
      name: 'Global Administrator',
      email: 'admin@manageengine.com',
      roleId: adminRole.id,
    },
  });

  const techUser = await prisma.user.upsert({
    where: { email: 'tech@zoho-corp.com' },
    update: { roleId: techRole.id },
    create: {
      name: 'Shawn Technician',
      email: 'tech@zoho-corp.com',
      roleId: techRole.id,
    },
  });

  const requesterUser = await prisma.user.upsert({
    where: { email: 'user@zoho-corp.com' },
    update: { roleId: requesterRole.id },
    create: {
      name: 'Farhan User',
      email: 'user@zoho-corp.com',
      roleId: requesterRole.id,
    },
  });

  // 3. Sites & Groups (Enterprise style)
  const sites = await Promise.all([
    prisma.site.upsert({ where: { name: 'Jakarta High-Rise' }, update: {}, create: { name: 'Jakarta High-Rise' } }),
    prisma.site.upsert({ where: { name: 'Surabaya Branch' }, update: {}, create: { name: 'Surabaya Branch' } }),
    prisma.site.upsert({ where: { name: 'Remote Office' }, update: {}, create: { name: 'Remote Office' } }),
  ]);

  const groups = await Promise.all([
    prisma.group.upsert({ where: { name: 'Network Infrastructure' }, update: {}, create: { name: 'Network Infrastructure' } }),
    prisma.group.upsert({ where: { name: 'Cloud Operations' }, update: {}, create: { name: 'Cloud Operations' } }),
    prisma.group.upsert({ where: { name: 'End User Computing' }, update: {}, create: { name: 'End User Computing' } }),
  ]);

  // 4. Categories, Priorities, Statuses, Impacts, Urgencies
  const catHardware = await prisma.category.upsert({ where: { name: 'Hardware > Laptop' }, update: {}, create: { name: 'Hardware > Laptop' } });
  const catNetwork = await prisma.category.upsert({ where: { name: 'Network > VPN' }, update: {}, create: { name: 'Network > VPN' } });
  const catSoftware = await prisma.category.upsert({ where: { name: 'Software > Application' }, update: {}, create: { name: 'Software > Application' } });

  const prioHigh = await prisma.priority.upsert({ where: { name: 'High' }, update: {}, create: { name: 'High', level: 'HIGH', color: '#e74c3c' } });
  const prioUrgent = await prisma.priority.upsert({ where: { name: 'Urgent' }, update: {}, create: { name: 'Urgent', level: 'URGENT', color: '#c0392b' } });
  const prioMedium = await prisma.priority.upsert({ where: { name: 'Medium' }, update: {}, create: { name: 'Medium', level: 'MEDIUM', color: '#f39c12' } });

  const statusOpen = await prisma.status.upsert({ where: { name: 'Open' }, update: {}, create: { name: 'Open', type: 'OPEN' } });
  const statusInProgress = await prisma.status.upsert({ where: { name: 'In Progress' }, update: {}, create: { name: 'In Progress', type: 'IN_PROGRESS' } });
  const statusResolved = await prisma.status.upsert({ where: { name: 'Resolved' }, update: {}, create: { name: 'Resolved', type: 'RESOLVED' } });

  const impOrg = await prisma.impact.upsert({ where: { name: 'Affects Organization' }, update: {}, create: { name: 'Affects Organization' } });
  const impUser = await prisma.impact.upsert({ where: { name: 'Affects User' }, update: {}, create: { name: 'Affects User' } });

  const urgImm = await prisma.urgency.upsert({ where: { name: 'Immediate' }, update: {}, create: { name: 'Immediate' } });
  const urgNorm = await prisma.urgency.upsert({ where: { name: 'Normal' }, update: {}, create: { name: 'Normal' } });

  // 5. Asset Management Seed
  const assetTypeLaptop = await prisma.assetType.upsert({ where: { name: 'Workstation > Laptop' }, update: {}, create: { name: 'Workstation > Laptop', isIT: true } });
  const assetTypeServer = await prisma.assetType.upsert({ where: { name: 'Workstation > Server' }, update: {}, create: { name: 'Workstation > Server', isIT: true } });
  
  const stateInUse = await prisma.assetState.upsert({ where: { name: 'In Use' }, update: {}, create: { name: 'In Use' } });
  const stateInStore = await prisma.assetState.upsert({ where: { name: 'In Store' }, update: {}, create: { name: 'In Store' } });

  const laptopAsset = await prisma.asset.upsert({
    where: { tag: 'AST-LP-001' },
    update: {},
    create: {
      name: 'MacBook Pro 16" - Farhan',
      tag: 'AST-LP-001',
      serialNumber: 'SN12345678',
      typeId: assetTypeLaptop.id,
      stateId: stateInUse.id,
      ownerId: requesterUser.id,
      siteId: sites[0].id,
    }
  });

  // 6. CMDB Seed
  const ciTypeService = await prisma.cIType.upsert({ where: { name: 'Business Service' }, update: {}, create: { name: 'Business Service' } });
  await prisma.cI.upsert({
    where: { id: 'ci-vpn-service' },
    update: {},
    create: {
      id: 'ci-vpn-service',
      name: 'Corporate VPN Service',
      typeId: ciTypeService.id,
    }
  });

  // 7. Problem Management Seed
  const problemVPN = await prisma.problem.create({
    data: {
      subject: 'Recurring VPN Gateway Disconnections',
      description: 'Multiple users reporting intermittent connection drops when connected to Jakarta gateway.',
      rootCause: 'Memory leak in firmware version 2.4.1 of the primary firewall.',
      impactAnalysis: 'Critical impact on remote work productivity for 200+ employees.',
      permanentSolution: 'Firmware upgrade scheduled for Sunday maintenance window.',
      workaround: 'Route traffic through Surabaya backup gateway.',
      statusId: statusInProgress.id,
      priorityId: prioUrgent.id,
      categoryId: catNetwork.id,
      technicianId: techUser.id,
    }
  });

  // 8. Change Management Seed
  await prisma.change.create({
    data: {
      subject: 'Upgrade VPN Gateway Firmware',
      description: 'Upgrade the primary VPN gateway firmware to v2.5.0 to resolve stability issues.',
      stage: 'Planning',
      statusId: statusOpen.id,
      priorityId: prioHigh.id,
      categoryId: catNetwork.id,
      technicianId: adminUser.id,
    }
  });

  // 9. Solution (Knowledge Base) Seed
  await prisma.solution.create({
    data: {
      subject: 'How to connect to Corporate VPN',
      content: '<p>Follow these steps to connect to the VPN gateway using FortiClient...</p>',
      topic: 'Network',
      status: 'Approved',
      isPublic: true,
    }
  });

  // 10. Request Links
  await prisma.request.deleteMany({});
  await prisma.request.create({
    data: {
      subject: 'Cannot connect to VPN from home',
      description: 'The vpn gateway is not responding since this morning.',
      requesterId: requesterUser.id,
      statusId: statusOpen.id,
      priorityId: prioUrgent.id,
      categoryId: catNetwork.id,
      siteId: sites[0].id,
      groupId: groups[0].id,
      problemId: problemVPN.id,
    },
  });

  console.log('✅ Seeding completed with Zoho-style Enterprise data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
