const express = require("express");
const app = express();

/** 1. Get method*/
//get handler
const getHand = function(req, res) {
  const obj = {
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Oladipupo Durojaiye",
      github: "@dipo-jaiye",
      email: "durojaiyep@yahoo.co.uk",
      mobile: "07088161687",
      twitter: "@dipo_jaiye"
    }
  };
  res.json(obj);
};
app.get("/", getHand);

/** 2. Post method*/
//midware to parse json requests
app.use(express.json());

//app.post("/validate-rule",(req,res)=>{}); for testing

//post handler
const postHand = function(req, res) {
  //error message function
  function err_mes(req, res, mes) {
    res.status(400).json({
      message: mes,
      status: "error",
      data: null
    });
  }
  //2a&f Checking for all data provided
  //payload is valid JSON or not
  if (Object.entries(req.body).length === 0) {
    let mes = "Invalid JSON payload passed.";
    err_mes(req, res, mes);
  }

  //rule is valid or not
  if (!req.body.rule) {
    let mes = "rule is required.";
    err_mes(req, res, mes);
  } else if (typeof req.body.rule != "object") {
    let mes = "rule should be an object.";
    err_mes(req, res, mes);
  } else if (Object.entries(req.body.rule).length === 0) {
    let mes = "rule is required.";
    err_mes(req, res, mes);
  }

  const rule_fields = ["field", "condition", "condition_value"];
  for (let i in rule_fields) {
    if (!req.body.rule[rule_fields[i]]) {
      let mes = `rule ${rule_fields[i]} is required.`;
      err_mes(req, res, mes);
    }
  }

  //data is valid or not
  if (!req.body.data) {
    let mes = "data is required.";
    err_mes(req, res, mes);
  } else if (typeof req.body.data != "object") {
    if (typeof req.body.data != "string") {
      let mes = "data should be an object or string.";
      err_mes(req, res, mes);
    }
  } else if (Object.entries(req.body.data).length === 0) {
    let mes = "data is required.";
    err_mes(req, res, mes);
  }

  //2g Checking for field is present
  if (!req.body.data[req.body.rule.field]) {
    let mes = `field ${req.body.rule.field} is missing from data.`;
    err_mes(req, res, mes);
  }

  //2h&i Checking for validity

  //function if validation is successful
  function success(req, res) {
    res.status(200).json({
      message: `field ${req.body.rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: req.body.rule.field,
          field_value: req.body.data[req.body.rule.field],
          condition: req.body.rule.condition,
          condition_value: req.body.rule.condition_value
        }
      }
    });
  }
  //function if validation fails
  function failure(req, res) {
    res.status(400).json({
      message: `field ${req.body.rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: req.body.rule.field,
          field_value: req.body.data[req.body.rule.field],
          condition: req.body.rule.condition,
          condition_value: req.body.rule.condition_value
        }
      }
    });
  }

  //validation
  switch (req.body.rule.condition) {
    case "eq":
      if (req.body.data[req.body.rule.field] == req.body.rule.condition_value) {
        success(req, res);
      } else {
        failure(req, res);
      }
    case "neq":
      if (req.body.data[req.body.rule.field] != req.body.rule.condition_value) {
        success(req, res);
      } else {
        failure(req, res);
      }
    case "gt":
      if (req.body.data[req.body.rule.field] > req.body.rule.condition_value) {
        success(req, res);
      } else {
        failure(req, res);
      }
    case "gte":
      if (req.body.data[req.body.rule.field] >= req.body.rule.condition_value) {
        success(req, res);
      } else {
        failure(req, res);
      }
    case "contains":
      switch (typeof req.body.data[req.body.rule.field]) {
        case "object":
          if (
            req.body.data[req.body.rule.field] in req.body.rule.condition_value
          ) {
            success(req, res);
          } else {
            failure(req, res);
          }
        case "string":
          if (
            req.body.data[req.body.rule.field].indexOf(
              req.body.rule.condition_value
            ) != -1
          ) {
            success(req, res);
          } else {
            failure(req, res);
          }
      }
    default:
      let mes = "Invalid rule condition passed.";
      err_mes(req, res, mes);
  }
};

app.post("/validate-rule", postHand);

module.exports = app;
