const db = require('../db/db');

class AuthController {
    async signIn(req, res) {
        const {username, password} = req.body;

        const user = await db.query("SELECT * FROM users WHERE username = $1", [username]);

        res.status(200).json({'group': user.rows[0].group})
    }
}

module.exports = new AuthController();