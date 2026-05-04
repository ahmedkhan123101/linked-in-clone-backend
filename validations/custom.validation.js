const password = (value, helpers) => {
    if (value.length < 6) {
        return helpers.message('Password must be at least 6 characters');
    }
    return value;
};

module.exports = { password, };
