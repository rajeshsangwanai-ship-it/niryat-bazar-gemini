import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateRFQSchema = z.object({
  buyerId: z.string().uuid(),
  title: z.string().min(5).max(120),
  mongoProductId: z.string().optional(),
  targetHsCode: z.string().min(4).max(10),
  quantity: z.number().positive(),
  unitOfMeasure: z.string().min(1),
  targetUnitPrice: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  destinationPort: z.string().min(2),
  preferredIncoterm: z.enum(['FOB', 'CIF', 'EXW', 'CFR', 'DDP', 'FCA']),
  paymentTerms: z.string().min(3),
  expiryDays: z.number().int().min(1).max(90),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = CreateRFQSchema.parse(body);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + payload.expiryDays);

    // Transaction guarantees RFQ creation and Audit Log integrity
    const result = await prisma.$transaction(async (tx) => {
      const rfq = await tx.rFQ.create({
        data: {
          buyerId: payload.buyerId,
          title: payload.title,
          mongoProductId: payload.mongoProductId,
          targetHsCode: payload.targetHsCode,
          quantity: payload.quantity,
          unitOfMeasure: payload.unitOfMeasure,
          targetUnitPrice: payload.targetUnitPrice,
          currency: payload.currency,
          destinationPort: payload.destinationPort,
          preferredIncoterm: payload.preferredIncoterm,
          paymentTerms: payload.paymentTerms,
          expiryDate: expiryDate,
          status: 'OPEN',
        },
      });

      await tx.auditLog.create({
        data: {
          userId: payload.buyerId,
          action: 'RFQ_CREATED',
          payload: { rfqId: rfq.id, hsCode: rfq.targetHsCode },
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      });

      return rfq;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}