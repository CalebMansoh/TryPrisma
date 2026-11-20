import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client";

const router = Router();

export default function userRoutes(prisma: PrismaClient) {
  router.post("/", async (req, res) => {
    try {
      const { name, email } = req.body;

      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });

      res.redirect(303, "/users/success");
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).send("Email already exists.");
      }

      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });

  router.get("/success", (req, res) => {
  res.send(`
    <h1>User Created Successfully!</h1>
    <p>The user has been saved to the database.</p>
    <a href="/">Create another user</a>
    <br>
    <a href="/letters">Create a letter</a>
  `);
});

  return router;
}