import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";
import userRoutes from "./routes/userRoutes";
import letterRoutes from "./routes/letterRoutes";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

//main and testing Async function
// async function main() {

//   //Creating User

//   // const user = await prisma.user.create({
//   //   data: {
//   //     name: 'Caleb',
//   //     email: 'caleb@gmail.com'
//   //   }
//   // })

//   // const letter = await prisma.letter.create({
//   //   data: {
//   //     address: 'Ghana',
//   //     title: "New Letter From Ghana",
//   //     body: " Hello",
//   //     writer: {
//   //       connect: {
//   //         id: 1
//   //       }
//   //     }
//   //   }
//   // })


//   const users = await prisma.user.findMany({
//     include:{
//       letters:true
//     }
//   })


//   // const user = await prisma.user.create({
//   //   data: {
//   //     name: "Ben",
//   //     email: "ben@gmail.com",
//   //     letters: {
//   //       create: {
//   //         address: "Ghana",
//   //         title: "Ben Letter",
//   //         body: "Hello Caleb"
//   //       }
//   //     }
//   //   }
//   // })


//   console.log(users)

// }


// main()
//   .then(async () =>{
//     await prisma.$disconnect();
//   })
//   .catch(async (e) =>{
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   })




const app = express();

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))


//HOME PAGE

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: "public/users"});
});

app.get("/letters", (req, res) => {
  res.sendFile("index.html", { root: "public/letters" });
});




//Routes

app.use("/users", userRoutes(prisma));
app.use("/letters", letterRoutes(prisma));



app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});