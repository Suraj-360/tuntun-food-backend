const router = require('express').Router();

// import controllers
const insertCategoryName = require('../controllers/categoryInsert')
const {signup, login, verifyEmail} = require('../controllers/auth');
const getAllOrdersWithFood = require('../controllers/fetchOrder');
const {getFoodData, addFoodData} = require('../controllers/foodData');
const orderFood = require('../controllers/orderFood');
const { fetchUserData, userDataUpdate, changePassword, deleteAccount } = require('../controllers/accMgmt');
const orderWithPayment = require('../controllers/orderPayment');


// import middlewares
const authorization = require('../middlewares/authZ');

// mount controller with routes
router.post("/insert-category-name/",insertCategoryName)
router.post("/signup/",signup);
router.get("/verify-email/", verifyEmail);
router.post("/login/",login);
router.post("/foodData/",getFoodData);
router.post("/addfooddata/",addFoodData);
router.post("/order-food/", authorization, orderFood);
router.post("/fetch-order-history/",authorization, getAllOrdersWithFood);
router.get("/fetch-user-data/",authorization, fetchUserData);
router.post("/update-user-data/",authorization, userDataUpdate);
router.post("/change-password/",authorization, changePassword);
router.post("/delete-account/",authorization, deleteAccount);
router.post("/payment/create-order/",authorization, orderWithPayment)
//router.post("/order-with-payment/",authorization, orderWithPayment);

module.exports = router;