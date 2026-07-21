export const test = (req, res) => {
    res.json({ message: 'API is working'})
}

export const updateUser = async (req, res, next) => {
    try {
        return res.status(200).json({user: req.user})
    } catch (error) {
        
    }
}