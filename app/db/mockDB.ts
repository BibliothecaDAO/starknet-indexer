// import { PrismaClient, Prisma } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//     let includePosts: boolean = false
//     let user: Prisma.UserCreateInput

//     // Check if posts should be included in the query
//     if (includePosts) {
//         user = {
//             email: 'elsa@prisma.io',
//             name: 'Elsa Prisma',
//             posts: {
//                 create: {
//                     title: 'Include this post!',
//                 },
//             },
//         }
//     } else {
//         user = {
//             email: 'elsa@prisma.io',
//             name: 'Elsa Prisma',
//         }
//     }

//     // Pass 'user' object into query
//     const createUser = await prisma.user.create({ data: user })
// }

// main()
//     .catch((e) => {
//         throw e
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })