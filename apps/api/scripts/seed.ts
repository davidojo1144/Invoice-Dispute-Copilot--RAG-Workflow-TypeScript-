import { faker } from '@faker-js/faker';
import { PrismaClient, InvoiceStatus, DisputeStatus, DocumentSource } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const tenantCount = 2;
  const tenants = [];
  for (let t = 0; t < tenantCount; t++) {
    const tenant = await prisma.tenant.create({
      data: { name: faker.company.name() }
    });
    tenants.push(tenant);
  }

  for (const tenant of tenants) {
    const vendors = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        prisma.vendor.create({
          data: { tenantId: tenant.id, name: faker.company.name() }
        })
      )
    );

    for (const vendor of vendors) {
      const invoicesToCreate = 1000;
      for (let i = 0; i < invoicesToCreate; i++) {
        const version = 1;
        const status = faker.helpers.arrayElement([
          InvoiceStatus.OPEN,
          InvoiceStatus.PAID,
          InvoiceStatus.DISPUTED
        ]);
        const invoice = await prisma.invoice.create({
          data: {
            tenantId: tenant.id,
            vendorId: vendor.id,
            status,
            version,
            totalAmount: faker.number.float({ min: 100, max: 50000, precision: 0.01 })
          }
        });

        const lineItems = Array.from({ length: 5 }).map(() => {
          const quantity = faker.number.int({ min: 1, max: 10 });
          const unitPrice = faker.number.float({ min: 10, max: 500, precision: 0.01 });
          const total = +(quantity * unitPrice).toFixed(2);
          return {
            invoiceId: invoice.id,
            description: faker.commerce.productName(),
            quantity,
            unitPrice,
            total
          };
        });
        await prisma.invoiceLineItem.createMany({ data: lineItems });

        if (status === InvoiceStatus.DISPUTED) {
          await prisma.dispute.create({
            data: {
              invoiceId: invoice.id,
              status: DisputeStatus.OPEN,
              reason: faker.lorem.sentence(),
              reconcileKey: `${invoice.id}:${version}`
            }
          });
        }
      }
    }

    const docs = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        prisma.document.create({
          data: {
            tenantId: tenant.id,
            source: faker.helpers.arrayElement([
              DocumentSource.CONTRACT,
              DocumentSource.EMAIL,
              DocumentSource.PURCHASE_ORDER
            ]),
            s3Key: `${process.env.S3_BUCKET ?? 'bucket'}/sample-${faker.string.alphanumeric(8)}.pdf`
          }
        })
      )
    );

    for (const doc of docs) {
      const chunks = Array.from({ length: 5 }).map((_, idx) => ({
        documentId: doc.id,
        chunkIdx: idx,
        content: faker.lorem.paragraph()
      }));
      for (const c of chunks) {
        await prisma.embedding.create({
          data: {
            documentId: c.documentId,
            chunkIdx: c.chunkIdx,
            content: c.content,
            vector: undefined as any
          }
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
