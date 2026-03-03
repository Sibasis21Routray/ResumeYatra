"use strict";
// import prisma from '../db/prisma'
async function clearTemplates() {
    try {
        console.log('Templates clearing disabled during migration');
        // const result = await prisma.template.deleteMany()
        // console.log(`Deleted ${result.count} templates`)
    }
    catch (error) {
        console.error('Error clearing templates:', error);
        process.exitCode = 1;
    }
    finally {
        // await prisma.$disconnect()
    }
}
clearTemplates();
