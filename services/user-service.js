const UserRepository = require("../database/repository/user-repository");
const {
  FormatData,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    const user = await this.repository.FindUser({ email });

    if (user) {
      const validPassword = await ValidatePassword(password, user.password);
      if (validPassword) {
        const token = await GenerateSignature({
          email: user.email,
          _id: user._id,
          role: user.role,
        });
        return FormatData({ id: user._id, token, role: user.role });
      }
    }

    return FormatData(null);
  }

  async SignUp(userInputs) {
    const { email, password, phone, role } = userInputs;

    let userPassword = await GeneratePassword(password);

    const user = await this.repository.CreateUser({
      email,
      password: userPassword,
      phone,
      role,
    });

    const token = await GenerateSignature({
      email: email,
      _id: user._id,
      role: role,
    });
    return FormatData({ id: user._id, token, role });
  }

  async AddProfile(_id, profileData) {
    const { name,gender,street, postalCode, city, country } = profileData;

    const profile = await this.repository.CreateProfile({
      _id,
      name,
      gender,
      street,
      postalCode,
      city,
      country,
    });

    return FormatData(profile);
  }


  async GetProfile(id) {
    const user = await this.repository.FindUserById({ id });
    console.log(user)
    return FormatData(user.profile);
  }

    async EditProfile(_id, profileData) {
    const { name,gender,street, postalCode, city, country } = profileData;

    const updatedProfile = await this.repository.EditProfile({
      _id,
      name,
      gender,
      street,
      postalCode,
      city,
      country,
    });

    return FormatData(updatedProfile);
  }

  async GetUser(id) {
    const user = await FindById(id).populate('profile');
    return FormatData(user);
  }

  async GetCart(id) {
    const user = await this.repository.FindUserById({ id });
    return FormatData(user.cart);
  }


  async GetWishList(id) {
    const user = await this.repository.FindUserById({ id });
    return FormatData(user.wishlist);
  }

  async AddToWishlist(userId, product) {
    const wishlistItem = await this.repository.AddWishlistItem(
      userId,
      product
    );
    return FormatData(wishlistItem);
  }

  async ManageCart(userId, product, qty, isRemove) {
    const cartResult = await this.repository.AddCartItem(
      userId,
      product,
      qty,
      isRemove
    );
    return FormatData(cartResult);
  }

  async ManageOrder(userId, order) {
    const orderResult = await this.repository.AddOrderToProfile(
      userId,
      order
    );
    return FormatData(orderResult);
  }

  async SubscribeEvents(payload) {

    payload = JSON.parse(payload);
    console.log(payload);

    const { event, data } = payload;
    console.log("EVENT AND DATA", event, data);

    const { userId, product, order, qty } = data;
    console.log(userId, product,'PRODUCT orderrr?????????', order, qty)

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;
      case "TEST":
        console.log("User service up and running man");
        break;
      default:
        break;
    }
  }
}

module.exports = UserService;
