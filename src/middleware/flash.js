const flash = (req, res, next) => {
    if (!req.session) {
        return next(new Error('Session is not available.'));
    }

    if (!req.session.flash) {
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };
    }

    req.flash = (type, message) => {
        if (type && message !== undefined) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);

            console.log('FLASH SAVED:', type, message);
            return;
        }

        if (type) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];

            console.log('FLASH RETRIEVED:', type, messages);
            return messages;
        }

        const messages = { ...req.session.flash };

        console.log('FLASH RETRIEVED:', messages);

        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return messages;
    };

    res.locals.flash = req.flash;

    next();
};

export default flash;
