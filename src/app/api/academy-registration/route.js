import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// POST: Register a new academy with admin user
export async function POST(request) {
  try {
    const {
      // Academy Information
      academyName,
      location,
      description,
      contactEmail,
      contactPhone,
      contactPerson,
      contactPersonPhone,
      password
    } = await request.json();

    // Validate required fields
    if (!academyName || !location || !contactEmail || !contactPhone || 
        !contactPerson || !contactPersonPhone || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if academy email already exists
    const existingAcademy = await prisma.academy.findFirst({
      where: { contactEmail: contactEmail }
    });

    if (existingAcademy) {
      return NextResponse.json(
        { error: "Academy with this contact email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate academy ID
    const academyId = `academy-${crypto.randomUUID()}`;

    // Create academy registration (pending approval) using raw SQL
    await prisma.$executeRaw`
      INSERT INTO Academy (id, name, location, description, contactEmail, contactPhone, 
                          contactPerson, contactPersonPhone, adminPassword, adminIds, status, createdAt)
      VALUES (${academyId}, ${academyName}, ${location}, ${description || null}, 
              ${contactEmail}, ${contactPhone}, ${contactPerson}, ${contactPersonPhone}, 
              ${hashedPassword}, ${JSON.stringify([])}, 'pending', NOW())
    `;

    // Get the created academy
    const academy = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, status, createdAt
      FROM Academy 
      WHERE id = ${academyId}
    `;

    // TODO: Send notification email to super admin
    // This would typically involve sending an email to notify admins of new registration
    console.log(`New academy registration: ${academyName} - ${contactEmail}`);

    return NextResponse.json(
      {
        message: "Academy registration submitted successfully. Our admin team will review your application.",
        academy: {
          id: academy[0].id,
          name: academy[0].name,
          location: academy[0].location,
          contactEmail: academy[0].contactEmail,
          status: academy[0].status
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Academy Registration Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists. Please use a different email." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register academy. Please try again." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
