//This creates a function that catches errors
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

