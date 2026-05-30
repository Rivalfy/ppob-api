const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers',
        'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { game, user_id, zone_id } = req.query;

    if (!game || !user_id) {
        return res.status(400).json({
            success: false,
            message: 'Parameter game dan user_id wajib'
        });
    }

    try {
        let result = { success: false, username: '' };
        const gameNorm = game.toLowerCase().trim();

        if (gameNorm.includes('mobile legend') ||
            gameNorm === 'ml' ||
            gameNorm === 'mlbb') {
            result = await cekML(user_id, zone_id);
        } else if (gameNorm.includes('free fire') ||
            gameNorm === 'ff') {
            result = await cekFF(user_id);
        } else if (gameNorm.includes('pubg')) {
            result = await cekPUBG(user_id);
        } else if (gameNorm.includes('genshin')) {
            result = await cekGenshin(user_id, zone_id);
        } else if (gameNorm.includes('call of duty') ||
            gameNorm.includes('cod')) {
            result = await cekCOD(user_id);
        } else {
            return res.status(200).json({
                success: false,
                message: 'Game belum didukung: ' + game
            });
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

async function cekML(userId, zoneId) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/91.0.4472.120 Mobile Safari/537.36',
            'Origin': 'https://shop.codashop.com',
            'Referer': 'https://shop.codashop.com/id/mobile-legends'
        };

        // Coba Unipin
        const resp = await axios.post(
            'https://www.unipin.com/games-topup/check-id',
            {
                game_id: 'MOBILE_LEGENDS',
                user_id: userId,
                server_id: zoneId || ''
            },
            { headers, timeout: 8000 }
        );

        if (resp.data && resp.data.status === 'success') {
            return {
                success: true,
                username: resp.data.username ||
                    resp.data.nickname || '',
                user_id: userId,
                zone_id: zoneId || ''
            };
        }
    } catch (e) {}

    // Coba Dunia Games
    try {
        const resp2 = await axios.get(
            `https://dungames.com/api/check-uid` +
            `?game=mobile-legends` +
            `&uid=${userId}` +
            `&server=${zoneId || ''}`,
            { timeout: 8000 }
        );
        if (resp2.data && resp2.data.nickname) {
            return {
                success: true,
                username: resp2.data.nickname,
                user_id: userId,
                zone_id: zoneId || ''
            };
        }
    } catch (e) {}

    // Coba itemku
    try {
        const resp3 = await axios.post(
            'https://itemku.com/g/top-up/check-user-id',
            {
                game_id: 'mobile-legends',
                user_id: userId,
                zone_id: zoneId || ''
            },
            { timeout: 8000 }
        );
        if (resp3.data && resp3.data.data &&
            resp3.data.data.username) {
            return {
                success: true,
                username: resp3.data.data.username,
                user_id: userId,
                zone_id: zoneId || ''
            };
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID tidak ditemukan atau' +
            ' layanan tidak tersedia'
    };
}

async function cekFF(userId) {
    try {
        const resp = await axios.post(
            'https://itemku.com/g/top-up/check-user-id',
            {
                game_id: 'free-fire',
                user_id: userId
            },
            { timeout: 8000 }
        );
        if (resp.data && resp.data.data &&
            resp.data.data.username) {
            return {
                success: true,
                username: resp.data.data.username,
                user_id: userId
            };
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID Free Fire tidak ditemukan'
    };
}

async function cekPUBG(userId) {
    try {
        const resp = await axios.post(
            'https://itemku.com/g/top-up/check-user-id',
            {
                game_id: 'pubg-mobile',
                user_id: userId
            },
            { timeout: 8000 }
        );
        if (resp.data && resp.data.data &&
            resp.data.data.username) {
            return {
                success: true,
                username: resp.data.data.username,
                user_id: userId
            };
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID PUBG tidak ditemukan'
    };
}

async function cekGenshin(userId, zoneId) {
    try {
        const resp = await axios.post(
            'https://itemku.com/g/top-up/check-user-id',
            {
                game_id: 'genshin-impact',
                user_id: userId,
                zone_id: zoneId || ''
            },
            { timeout: 8000 }
        );
        if (resp.data && resp.data.data &&
            resp.data.data.username) {
            return {
                success: true,
                username: resp.data.data.username,
                user_id: userId,
                zone_id: zoneId || ''
            };
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID Genshin tidak ditemukan'
    };
}

async function cekCOD(userId) {
    try {
        const resp = await axios.post(
            'https://itemku.com/g/top-up/check-user-id',
            {
                game_id: 'call-of-duty-mobile',
                user_id: userId
            },
            { timeout: 8000 }
        );
        if (resp.data && resp.data.data &&
            resp.data.data.username) {
            return {
                success: true,
                username: resp.data.data.username,
                user_id: userId
            };
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID COD tidak ditemukan'
    };
                }
