const User = require("../models/user");

module.exports = {
    renderRegister: (req, res) => {
        res.render("users/register");
    },
    submitRegister: async (req, res, next) => {
        try {
            const { email, username, password } = req.body;
            const user = await new User({ email, username });
            const newUser = await User.register(user, password);
            req.login(newUser, err => {
                if (err) return next(err);
                req.flash("success", "Welcome to Hike Trails");
                res.redirect("/hikes");
            })
        } catch (err) {
            req.flash("error", err.message)
            res.redirect("register");
        }
    },
    renderLogin: (req, res) => {
        res.render("users/login");
    },
    login: (req, res) => {
        req.flash("success", "welcome back!");
        const redirectUrl = req.session.returnTo || "/hikes";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    },
    logout: (req, res) => {
        req.logout();
        req.flash("success", "Goodbye!");
        res.redirect("/hikes");
    }
}