"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixeConfigValidatorV2 = exports.perdiemConfigValidatorV2 = exports.discountConfigValidatorV2 = exports.baseVoucherValidatorV2 = exports.createVoucherProgramValidatorV2 = exports.ProgramStatus = exports.VoucherProgramStatus = exports.VoucherTypeLower = exports.VoucherType = exports.PaymentType = exports.VoucherPayer = void 0;
const yup = require("yup");
var VoucherPayer;
(function (VoucherPayer) {
    VoucherPayer["BUTLER"] = "BUTLER";
    VoucherPayer["HOTEL"] = "HOTEL";
})(VoucherPayer = exports.VoucherPayer || (exports.VoucherPayer = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["PERCENTAGE"] = "PERCENTAGE";
    PaymentType["FIXED"] = "FIXED";
})(PaymentType = exports.PaymentType || (exports.PaymentType = {}));
var VoucherType;
(function (VoucherType) {
    VoucherType["DISCOUNT"] = "DISCOUNT";
    VoucherType["PER_DIEM"] = "PER_DIEM";
    VoucherType["PRE_FIXE"] = "PRE_FIXE";
})(VoucherType = exports.VoucherType || (exports.VoucherType = {}));
var VoucherTypeLower;
(function (VoucherTypeLower) {
    VoucherTypeLower["DISCOUNT"] = "Discount";
    VoucherTypeLower["PER_DIEM"] = "Per Diem";
    VoucherTypeLower["PRE_FIXE"] = "Pre Fixe";
})(VoucherTypeLower = exports.VoucherTypeLower || (exports.VoucherTypeLower = {}));
var VoucherProgramStatus;
(function (VoucherProgramStatus) {
    VoucherProgramStatus["ACTIVE"] = "Active";
    VoucherProgramStatus["INACTIVE"] = "Inactive";
})(VoucherProgramStatus = exports.VoucherProgramStatus || (exports.VoucherProgramStatus = {}));
var ProgramStatus;
(function (ProgramStatus) {
    ProgramStatus["ACTIVE"] = "ACTIVE";
    ProgramStatus["INACTIVE"] = "INACTIVE";
})(ProgramStatus = exports.ProgramStatus || (exports.ProgramStatus = {}));
const ruleValidator = yup
    .object()
    .noUnknown(true)
    .required()
    .shape({
    quantity: yup
        .number()
        .typeError("Quantity is a required field!")
        .required(),
    max_price: yup
        .number()
        .typeError("Price Limit is a required field!")
        .positive("Amount should be a positive number!")
        .required(),
    categories: yup
        .array()
        .min(1, "Categories is a required field! 1")
        .of(yup.number().typeError("Categories is a required field! 2").required())
        .required("Categories is a required field! 3"),
});
const baseVoucherValidator = yup
    .object()
    .required()
    .shape({
    name: yup.string().required("Voucher Program is a required field!"),
    payer: yup.string().required("Payer is a required field!"),
    payer_percentage: yup
        .number()
        .typeError("Payer Percentage is a required field!")
        .required(),
    notes: yup.string().optional(),
    description: yup.string().optional(),
    code_limit: yup
        .number()
        .typeError("Code limit is a required field!")
        .moreThan(0, "Code limit must be more than 0!")
        .required(),
    status: yup.string().optional(),
});
exports.baseVoucherValidatorV2 = baseVoucherValidator;
const createVoucherProgramValidator = baseVoucherValidator.concat(yup.object().shape({
    hotel_id: yup
        .number()
        .typeError("Hotel is a required field!")
        .required("Hotel is a required field!"),
    type: yup.string().required("Voucher Type is a required field!"),
    amount_type: yup.string().when("type", {
        is: VoucherType.DISCOUNT,
        then: yup.string().required("Amount Type is a required field!"),
    }),
    amount: yup.number().when("amount_type", {
        is: PaymentType.PERCENTAGE,
        then: yup
            .number()
            .typeError("Amount is a required field!")
            .moreThan(0, "Amount must be positive and more than 0%!")
            .max(100, "Amount must be less than 100%!")
            .required("Amount is a required field!"),
        otherwise: yup
            .number()
            .typeError("Amount is a required field!")
            .required("Amount is a required field!")
            .positive("Amount should be a positive number!"),
    }),
    rules: yup
        .array()
        .of(ruleValidator)
        .when("type", {
        is: VoucherType.PRE_FIXE,
        then: yup
            .array()
            .of(ruleValidator)
            .required("Categories is a required field!"),
    }),
}));
exports.createVoucherProgramValidatorV2 = createVoucherProgramValidator;
const amountTypeValidator = yup.object().shape({
    // DISCOUNT
    amount_type: yup.string().required("Amount Type is a required field!"),
});
const amountValidator = yup.object().shape({
    // DISCOUNT, PER_DIEM, PRE_FIXE
    amount: yup.number().when("amount_type", {
        is: PaymentType.PERCENTAGE,
        then: yup
            .number()
            .typeError("Amount is a required field!")
            .moreThan(0, "Amount must be positive and more than 0%!")
            .max(100, "Amount must be less than 100%!")
            .required(),
        otherwise: yup
            .number()
            .typeError("Amount is a required field!")
            .positive("Amount should be a positive number!")
            .required(),
    }),
});
const rulesValidator = yup.object().shape({
    // PRE_FIXE
    rules: yup
        .array()
        .of(ruleValidator)
        .required("Categories is a required field! 0"),
});
// EDIT CONFIGS
const discountConfigValidator = amountTypeValidator.concat(amountValidator);
exports.discountConfigValidatorV2 = discountConfigValidator;
const perdiemConfigValidator = amountValidator;
exports.perdiemConfigValidatorV2 = perdiemConfigValidator;
const prefixeConfigValidator = amountValidator.concat(rulesValidator);
exports.prefixeConfigValidatorV2 = prefixeConfigValidator;
//# sourceMappingURL=program.js.map