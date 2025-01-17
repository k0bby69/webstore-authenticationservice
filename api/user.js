const UserService = require("../services/user-service");
const auth = require("./middleware/auth");
const { SubscribeMessage } = require("../utils");

userRoutes = (app, channel) => {
  const service = new UserService();

  SubscribeMessage(channel, service);

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone, role } = req.body;

      const { data } = await service.SignUp({ email, password, phone, role });      
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    const { data } = await service.SignIn({ email, password });

    res.json(data);
  });

  app.post("/profile", auth, async (req, res, next) => {
    const { _id } = req.user;

    const { name,gender,street, postalCode, city, country } = req.body;

    const { data } = await service.AddProfile(_id, {
      name,
      gender,
      street,
      postalCode,
      city,
      country,
    });


    res.json(data);
  });

  app.put("/profile", auth, async (req, res, next) => {
    const { _id } = req.user;

    const { name,gender,street, postalCode, city, country } = req.body;

    const { data } = await service.EditProfile(_id, {
      name,
      gender,
      street,
      postalCode,
      city,
      country,
    });

    
    res.json(data);
  });

  app.get("/profile", auth, async (req, res, next) => {

    const { _id } = req.user;
    const { data } = await service.GetProfile({ _id });
    res.json(data);
  });



  app.get("/cart", auth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetCart(_id);

    return res.json(data);
  });

  app.get("/wishlist", auth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetWishList(_id);
    return res.status(200).json(data);
  });

  app.get("/", auth, async (req, res, next) => {
    const {user}=await service.GetUser(req.user._id)
    return res.status(200).json(user);
  });
};

module.exports = userRoutes;
