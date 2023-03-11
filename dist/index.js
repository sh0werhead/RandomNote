"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const sanitizer_1 = require("sanitizer");
const field_template_1 = require("./field_template");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pool = new pg_1.Pool({
    user: "postgres",
    password: "kye040109",
    database: "mydb",
    host: "localhost",
    port: 5432
});
app.get("/", (req, res) => {
    res.send("hello world!!");
});
app.post("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body) {
            var { dirty_title, dirty_bodytxt } = req.body;
            var title = (0, sanitizer_1.sanitize)(dirty_title);
            var bodytxt = (0, sanitizer_1.sanitize)(dirty_bodytxt);
            pool.query(`INSERT INTO note VALUES ('${title}', '${bodytxt}');`);
            return res.status(201).json({
                code: 201,
            });
        }
        else {
            throw 0;
        }
    }
    catch (_a) {
        return res.status(418).json({
            code: 418,
            value: "{}"
        });
    }
}));
app.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body) {
            const value = yield pool.query(`SELECT * FROM note;`);
            if (value.rowCount) {
                const i = (0, crypto_1.randomInt)(value.rowCount);
                return res.status(200).json({
                    code: 200,
                    value: value.rows[i]
                });
            }
            else {
                return res.status(204).json({
                    code: 204,
                    value: "{}"
                });
            }
        }
        else {
            throw 0;
        }
    }
    catch (_b) {
        return res.status(418).json({
            code: 418,
            value: "{}"
        });
    }
}));
app.get("/field", (req, res) => {
    console.log((0, field_template_1.template)());
    res.send((0, field_template_1.template)());
});
app.listen(4000, () => {
    console.log("RN on 4000");
});
