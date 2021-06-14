const OneSignal = require('onesignal-node'); // One signal library

// One signal client setup with appId and API Key
const client = new OneSignal.Client('c6b271b8-32fa-4756-8459-6273d089b9fc', 'MzRhMGFiZjAtMTdkYy00MzFmLThmNzUtMGE3MTIzZTkzNzg4');

// User model
const User = require('../models/User')

exports.sendToAll = async function(text, title, payload = null) {
    var notification = {
        contents: {
            'en': text,
        },
        headings: {
            'en': title
        },
        included_segments: ['Subscribed Users']
    };

    if (payload !== null) {
        notification.data = payload;
    }

    // using async/await
    try {
        const response = await client.createNotification(notification);
        return { status: true, content: response };
    } catch (e) {
        return { status: false, content: e };
    }
}

exports.sendToSegments = async function(text, title, segments, payload = null) {
    var notification = {
        contents: {
            'en': text,
        },
        headings: {
            'en': title
        },
        included_segments: segments
    };

    if (payload !== null) {
        notification.data = payload;
    }

    // using async/await
    try {
        const response = await client.createNotification(notification);
        return { status: true, content: response };
    } catch (e) {
        return { status: false, content: e };
    }
}

exports.sendToUserList = async function(text, title, users, payload = null) {
    var notification = {
        contents: {
            'en': text,
        },
        headings: {
            'en': title
        },
        include_player_ids: users
    };

    if (payload !== null) {
        notification.data = payload;
    }

    // using async/await
    try {
        const response = await client.createNotification(notification);
        return { status: true, content: response };
    } catch (e) {
        return { status: false, content: e };
    }
}

exports.sendByUserId = async function(text, title, uid, payload = null) {
    const user = await User.findById(uid);
    if (!user) {
        return { status: false, content: "No user" };
    } else if (user.notification_id && user.notification_id.length > 0) {
        var notification = {
            contents: {
                'en': text,
            },
            headings: {
                'en': title
            },
            include_player_ids: user.notification_id
        };
        if (payload !== null) {
            notification.data = payload;
        }

        // using async/await
        try {
            const response = await client.createNotification(notification);
            return { status: true, content: response };
        } catch (e) {
            return { status: false, content: e };
        }
    }
}