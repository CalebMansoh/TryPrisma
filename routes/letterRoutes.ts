import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client";

export default function letterRoutes(prisma: PrismaClient) {
  const router = Router();

  // Search for writers
  router.get("/writers/search", async (req, res) => {
    try {
      const search = String(req.query.q || "").trim();

      if (!search) {
        return res.json([]);
      }

      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: 10,
      });

      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Failed to search writers",
      });
    }
  });

  // Create letter
  router.post("/", async (req, res) => {
    try {
      const { address, title, body, writerId } = req.body;

      const letter = await prisma.letter.create({
        data: {
          address,
          title,
          body,
          writerId: Number(writerId),
        },
      });

      res.redirect(303, "/letters/success");
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to create letter.");
    }
  });

  router.get("/success", (req, res) => {
  res.send(`
    <h1>Letter Created Successfully!</h1>
    <p>Your letter has been saved to the database.</p>
    <a href="/letters">Create another letter</a>
    <br>
    <a href="/">Create a user</a>
  `);
});

  return router;
}