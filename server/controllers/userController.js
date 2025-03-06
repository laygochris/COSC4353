const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const key = 'yourSecretKey';

const filePath = path.join(__dirname, '../data/users.json');

