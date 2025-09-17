import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// POST: Approve or reject academy registration
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Academy ID is required" },
        { status: 400 }
      );
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get academy details
    const academy = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, adminPassword, status
      FROM Academy 
      WHERE id = ${id} AND status = 'pending'
    `;

    if (!academy || academy.length === 0) {
      return NextResponse.json(
        { error: "Academy not found or already processed" },
        { status: 404 }
      );
    }

    const academyData = academy[0];

    if (action === 'approve') {
      // Create admin user for the academy
      const adminEmail = academyData.contactEmail;
      const adminName = academyData.contactPerson || 'Academy Admin';
      const adminPhone = academyData.contactPersonPhone || academyData.contactPhone;
      
      // Use the stored hashed password from registration
      const hashedPassword = academyData.adminPassword;

      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          role: "admin",
          fullName: adminName,
          email: adminEmail,
          password: hashedPassword,
          phone: adminPhone,
          academyId: id,
          isEmailVerified: false,
          verificationToken: crypto.randomUUID(),
          createdAt: new Date(),
        }
      });

      // Update academy status and admin IDs
      await prisma.$executeRaw`
        UPDATE Academy 
        SET status = 'approved', 
            adminIds = ${JSON.stringify([adminUser.id])},
            updatedAt = NOW()
        WHERE id = ${id}
      `;

      // TODO: Send approval email with login credentials
      console.log(`Academy approved: ${academyData.name}`);
      console.log(`Admin can now login with: ${adminEmail}`);

      return NextResponse.json(
        {
          message: "Academy approved successfully",
          academy: {
            id: academyData.id,
            name: academyData.name,
            status: 'approved'
          },
          admin: {
            email: adminEmail,
            message: "Admin can now login with their registered password"
          }
        },
        { status: 200 }
      );

    } else if (action === 'reject') {
      // Update academy status to rejected
      await prisma.$executeRaw`
        UPDATE Academy 
        SET status = 'rejected', 
            updatedAt = NOW()
        WHERE id = ${id}
      `;

      // TODO: Send rejection email
      console.log(`Academy rejected: ${academyData.name}`);

      return NextResponse.json(
        {
          message: "Academy rejected successfully",
          academy: {
            id: academyData.id,
            name: academyData.name,
            status: 'rejected'
          }
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Academy Approval Error:", error);
    return NextResponse.json(
      { error: "Failed to process academy approval" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
