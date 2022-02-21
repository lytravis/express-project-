const express = require("express");
const router = express.Router();

const { requireAuth } = require("../auth");
const { csrfProtection, asyncHandler } = require("./utils");

const db = require("../db/models");
const { Game, Genre, Review, GameShelf, User } = db;

router.get("/", asyncHandler(async (req, res) => {
    const games = await Game.findAll();
    res.render("games-page", { games });
  })
);



router.get(
  "/:gameId(\\d+)",
  csrfProtection,
  asyncHandler(async(req, res) => {
    if (req.session.auth){
      const userId = req.session.auth.userId;
      const gameshelves = await GameShelf.findAll({
        include: [{
          model: User,
          where: { id: userId }
        }]
      })
      const users = await User.findAll()
      const id = req.params.gameId;
      const game = await Game.findByPk(id);
      const reviews = await Review.findAll({
        where: { gameId: id }
      })
      res.render("one-game-page", {game, reviews, userId, gameshelves, users, csrfToken: req.csrfToken()})
    } else {
      const id = req.params.gameId;
      const users = await User.findAll()
      const game = await Game.findByPk(id);
      const reviews = await Review.findAll({
        where: {gameId: id}
      })
      res.render("one-game-page", {game, reviews, users})
    }
}));

module.exports = router;
