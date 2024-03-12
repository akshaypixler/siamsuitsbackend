const path = require("path");
const express = require("express");
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require("cors");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const AppError = require('./utills/appError');
const GlobalError = require('./utills/errorController')
const authRoute = require("./admin/routes/authentication")
const manualOrderRoute = require("./admin/routes/router.ManualOrder")
const orderRoute = require("./admin/routes/router.Order")
const rolesRoute = require("./admin/routes/routes.roles")
const retailersRoute = require("./admin/routes/routes.retailer")
const productsRoute = require("./admin/routes/routes.products")
const measurementsRoute = require("./admin/routes/routes.measurement")
const featuresRoute = require("./admin/routes/routes.features")
const stylesRoute = require("./admin/routes/routes.styles")
const customFittingsRoutes = require("./admin/routes/routes.customFittings");
const PipingRoute = require("./admin/routes/router.piping");
const groupFeaturesRoutes = require("./admin/routes/router.groupFeatures");
const imageUploadRoute = require("./imageRoute");
const customerMeasurements = require("./retailer/routes/routes.customerMeasurements")
const retailerRoutes = require("./retailer/routes/routes.order");
const positionRoutes = require("./admin/routes/factoryRoutes/router.position");
const tailerRoutes = require("./admin/routes/factoryRoutes/router.tailer");
const groupOrderRouter = require("./retailer/routes/routes.groupOrder");
const retailerInvoiceRoutes = require("./admin/routes/routes.retailerInvoices");
const DraftMeasurements = require("./retailer/routes/routes.draftedMeasurements");
const tailorRoutesApp = require("./tailor/routes.tailor")
const extraPaymentCategoriesRoutes = require("./admin/routes/factoryRoutes/routes.extraPaymentCategories")
const workerAdvancePaymentsRoutes = require("./admin/routes/factoryRoutes/routes.workerAdvancePayments")
const workerExtraPaymentsRoutes = require("./admin/routes/factoryRoutes/routes.extraPayments")
const PaymentsRoutes = require("./admin/routes/factoryRoutes/routes.payments")
const shippingRoutes = require("./admin/routes/shipping/routes.shipping")
const jobRoutes = require("./admin/routes/factoryRoutes/routes.jobs")


// call GLOBAL MIDDLEWARES
const app = express();
app.enable('trust proxy');

app.use(cors());

app.options('*', cors());

app.use(express.json({limit: '50mb'}));

// Serving static files
app.use("/images", express.static(path.join("images")));
// Serving static files (pdf)
app.use("/pdf", express.static(path.join("pdf")));

// Serving static files (pdf)
app.use("/ImagesFabric", express.static(path.join("ImagesFabric")));
app.use(helmet());


// Development logging
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('dev'));
}


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());


app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});


app.get('/', (req, res) => res.render('Hellooooo'))
app.use("/auth", authRoute);
app.use("/orders", orderRoute);
app.use("/manualOrders", manualOrderRoute);
app.use("/roles", rolesRoute);
app.use("/retailer", retailersRoute);
app.use("/product", productsRoute);
app.use("/measurement", measurementsRoute);
app.use("/feature", featuresRoute);
app.use("/groupFeatures", groupFeaturesRoutes);
app.use("/style", stylesRoute);
app.use("/customFittings", customFittingsRoutes);
app.use("/userMeasurement", customerMeasurements);
app.use("/image", imageUploadRoute);
app.use("/customerOrders", retailerRoutes);
app.use("/groupOrders", groupOrderRouter)
app.use("/piping", PipingRoute);

app.use("/position", positionRoutes);
app.use("/tailer", tailerRoutes)
app.use("/retailerInvoice", retailerInvoiceRoutes)
app.use("/draftMeasurements", DraftMeasurements)
app.use("/extraPaymentCategory", extraPaymentCategoriesRoutes)
app.use("/workerAdvancePayment", workerAdvancePaymentsRoutes)
app.use("/workerExtraPayments", workerExtraPaymentsRoutes)
app.use("/payments", PaymentsRoutes)
app.use("/tailor", tailorRoutesApp)
app.use("/job", jobRoutes)
app.use("/shipping", shippingRoutes)


app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalError);

module.exports = app;