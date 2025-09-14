import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const sampleBuyers = [
  {
    fullName: "Rajesh Ku",
    email: "rajesh.kumar@email.com",
    phone: "+919876543210",
    city: "Chandigarh" as const,
    propertyType: "Apartment" as const,
    bhk: "Two" as const,
    purpose: "Buy" as const,
    budgetMin: 5000000,
    budgetMax: 8000000,
    timeline: "ZeroToThreeMonths" as const,
    source: "Website" as const,
    status: "New" as const,
    notes: "Looking for a well-ventilated 2BHK apartment in Sector 22",
    tags: ["first-time-buyer", "urgent"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Priya Shah",
    email: "priya.sharma@gmail.com",
    phone: "+919876543211",
    city: "Mohali" as const,
    propertyType: "Villa" as const,
    bhk: "Three" as const,
    purpose: "Buy" as const,
    budgetMin: 12000000,
    budgetMax: 18000000,
    timeline: "ThreeToSixMonths" as const,
    source: "Referral" as const,
    status: "Qualified" as const,
    notes: "Prefers villa with garden and parking space",
    tags: ["premium", "family"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Amit Singhania",
    email: "amit.singh@yahoo.com",
    phone: "+919876543212",
    city: "Zirakpur" as const,
    propertyType: "Plot" as const,
    purpose: "Buy" as const,
    budgetMin: 3000000,
    budgetMax: 5000000,
    timeline: "MoreThanSixMonths" as const,
    source: "WalkIn" as const,
    status: "Contacted" as const,
    notes: "Looking for residential plot for future construction",
    tags: ["investment", "patient"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Neha Gupto",
    email: "neha.gupta@hotmail.com",
    phone: "+919876543213",
    city: "Panchkula" as const,
    propertyType: "Apartment" as const,
    bhk: "One" as const,
    purpose: "Rent" as const,
    budgetMin: 15000,
    budgetMax: 25000,
    timeline: "ZeroToThreeMonths" as const,
    source: "Call" as const,
    status: "Visited" as const,
    notes: "Single professional looking for furnished 1BHK",
    tags: ["working-professional", "furnished"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Sandeep Vanga",
    email: "sandeep.verma@company.com",
    phone: "+919876543214",
    city: "Chandigarh" as const,
    propertyType: "Office" as const,
    purpose: "Rent" as const,
    budgetMin: 50000,
    budgetMax: 100000,
    timeline: "ThreeToSixMonths" as const,
    source: "Website" as const,
    status: "Negotiation" as const,
    notes: "Startup looking for office space in IT park",
    tags: ["business", "startup", "it-sector"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Kavita Mohapatra",
    email: "kavita@business.com",
    phone: "+919876543215",
    city: "Mohali" as const,
    propertyType: "Retail" as const,
    purpose: "Buy" as const,
    budgetMin: 8000000,
    budgetMax: 12000000,
    timeline: "ZeroToThreeMonths" as const,
    source: "Referral" as const,
    status: "Converted" as const,
    notes: "Successfully purchased retail space for boutique store",
    tags: ["retail", "boutique", "converted"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Ravi Chaberia",
    phone: "+919876543216",
    city: "Other" as const,
    propertyType: "Apartment" as const,
    bhk: "Four" as const,
    purpose: "Buy" as const,
    budgetMin: 15000000,
    budgetMax: 20000000,
    timeline: "Exploring" as const,
    source: "Other" as const,
    status: "New" as const,
    notes: "Relocating from Delhi, exploring options",
    tags: ["relocation", "luxury"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Deepika Agaria",
    email: "deepika.agarwal@email.com",
    phone: "+919876543217",
    city: "Zirakpur" as const,
    propertyType: "Villa" as const,
    bhk: "Four" as const,
    purpose: "Rent" as const,
    budgetMin: 80000,
    budgetMax: 120000,
    timeline: "ThreeToSixMonths" as const,
    source: "Call" as const,
    status: "Dropped" as const,
    notes: "Budget constraints, looking for cheaper alternatives",
    tags: ["budget-constraints", "dropped"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Mohit Bansiwala",
    email: "mohit.bansal@techfirm.com",
    phone: "+919876543218",
    city: "Panchkula" as const,
    propertyType: "Apartment" as const,
    bhk: "Studio" as const,
    purpose: "Rent" as const,
    budgetMin: 12000,
    budgetMax: 18000,
    timeline: "ZeroToThreeMonths" as const,
    source: "Website" as const,
    status: "Qualified" as const,
    notes: "Fresh graduate, first job, looking for studio apartment",
    tags: ["fresh-graduate", "first-job"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
  {
    fullName: "Sunita Jinnah",
    email: "sunita.jindal@realty.com",
    phone: "+919876543219",
    city: "Chandigarh" as const,
    propertyType: "Plot" as const,
    purpose: "Buy" as const,
    budgetMin: 8000000,
    budgetMax: 15000000,
    timeline: "MoreThanSixMonths" as const,
    source: "WalkIn" as const,
    status: "Contacted" as const,
    notes: "Investment purpose, looking for commercial plots",
    tags: ["investment", "commercial"],
    ownerId: "00000000-0000-4000-8000-000000000001",
  },
];

async function main() {
  console.log('🌱 Starting database seed...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing buyer data...');
    // await prisma.buyerHistory.deleteMany();
    // await prisma.buyer.deleteMany();
    
    // Create buyers
    console.log('👥 Creating sample buyers...');
    const createdBuyers = await Promise.all(
      sampleBuyers.map((buyer, index) => {
        console.log(`  Creating buyer ${index + 1}: ${buyer.fullName}`);
        return prisma.buyer.create({
          data: buyer,
        });
      })
    );
    
    console.log(`✅ Successfully created ${createdBuyers.length} buyers!`);
    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    const counts = await Promise.all([
      prisma.buyer.count(),
      prisma.buyer.count({ where: { purpose: 'Buy' } }),
      prisma.buyer.count({ where: { purpose: 'Rent' } }),
      prisma.buyer.count({ where: { status: 'New' } }),
      prisma.buyer.count({ where: { status: 'Converted' } }),
    ]);
    
    console.log('\n📊 Database Summary:');
    console.log(`   Total Buyers: ${counts[0]}`);
    console.log(`   Buy Enquiries: ${counts[1]}`);
    console.log(`   Rent Enquiries: ${counts[2]}`);
    console.log(`   New Leads: ${counts[3]}`);
    console.log(`   Converted Leads: ${counts[4]}`);
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 