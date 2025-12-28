exports.isHR = (req, res, next) => {
    if (req.user.role !== 'HR') {
        return res.status(403).json({ message: 'HR access only' });
    }
    next();
};
