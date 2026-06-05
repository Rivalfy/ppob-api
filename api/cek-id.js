const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { game, user_id, zone_id } = req.query;

    if (!game || !user_id) {
        return res.json({
            success: false,
            message: 'Parameter game dan user_id wajib'
        });
    }

    const gameNorm = game.toLowerCase().trim();

    try {
        let result = { success: false, username: '' };

        if (gameNorm.includes('mobile legend') ||
            gameNorm === 'ml' ||
            gameNorm === 'mlbb') {
            result = await cekMLBB(user_id, zone_id);
        } else if (gameNorm.includes('free fire') ||
            gameNorm === 'ff') {
            result = await cekFF(user_id);
        } else if (gameNorm.includes('pubg')) {
            result = await cekPUBG(user_id);
        } else if (gameNorm.includes('genshin')) {
            result = await cekGenshin(
                user_id, zone_id);
        } else if (gameNorm.includes('honkai')) {
            result = await cekHonkai(
                user_id, zone_id);
        } else if (
            gameNorm.includes('call of duty') ||
            gameNorm.includes('cod')) {
            result = await cekCOD(user_id);
        } else {
            result = {
                success: false,
                message: 'Game ' + game +
                    ' belum didukung'
            };
        }

        return res.json(result);

    } catch (e) {
        return res.json({
            success: false,
            message: e.message
        });
    }
};

// Dunia Games - ML
async function cekMLBB(userId, zoneId) {
    const zone = zoneId || '';

    // Coba Dunia Games dengan berbagai productId
    const productIds = [1, 2, 3, 100, 200];

    for (const pid of productIds) {
        try {
            const r = await axios.post(
                'https://api.duniagames.co.id/api/' +
                'transaction/v1/top-up/inquiry/store',
                {
                    productId: pid,
                    paymentId: 1,
                    itemId: 1,
                    catalogId: 1,
                    userId: userId,
                    serverId: zone
                },
                {
                    headers: {
                        'Content-Type':
                            'application/json',
                        'User-Agent': 'Mozilla/5.0 ' +
                            '(Linux; Android 12) ' +
                            'Chrome/112.0.0.0',
                        'Accept': 'application/json',
                        'Origin':
                            'https://www.duniagames.co.id',
                        'Referer':
                            'https://www.duniagames.co.id/'
                    },
                    timeout: 8000
                }
            );

            if (r.data) {
                // Cek berbagai format response
                const d = r.data;
                let nama = '';

                if (d.data && d.data.playerName)
                    nama = d.data.playerName;
                else if (d.data && d.data.username)
                    nama = d.data.username;
                else if (d.data && d.data.nickname)
                    nama = d.data.nickname;
                else if (d.playerName)
                    nama = d.playerName;
                else if (d.username)
                    nama = d.username;
                else if (d.nickname)
                    nama = d.nickname;
                else if (d.name)
                    nama = d.name;

                if (nama) {
                    return {
                        success: true,
                        username: nama,
                        user_id: userId,
                        zone_id: zone
                    };
                }
            }
        } catch (e) {
            // lanjut coba productId berikutnya
        }
    }

    // Coba endpoint Dunia Games lain
    try {
        const r2 = await axios.get(
            'https://www.duniagames.co.id/api/' +
            'game/check-user?' +
            'game=mobile-legends' +
            '&userId=' + userId +
            '&serverId=' + zone,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                },
                timeout: 8000
            }
        );
        if (r2.data) {
            const d2 = r2.data;
            const nama2 = d2.username ||
                d2.playerName ||
                d2.nickname ||
                (d2.data && d2.data.username) || '';
            if (nama2) {
                return {
                    success: true,
                    username: nama2,
                    user_id: userId,
                    zone_id: zone
                };
            }
        }
    } catch (e2) {}

    // Coba UniPin
    try {
        const r3 = await axios.post(
            'https://sandbox.unipin.com/v2/' +
            'service/check_user',
            {
                service_id: 'MOBILELEGEND',
                user_id: userId,
                server_id: zone
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 8000
            }
        );
        if (r3.data && r3.data.status === 'success') {
            return {
                success: true,
                username: r3.data.username ||
                    r3.data.nickname || userId,
                user_id: userId,
                zone_id: zone
            };
        }
    } catch (e3) {}

    // Coba Topup.gg
    try {
        const r4 = await axios.post(
            'https://topup.gg/api/check-id',
            {
                game: 'mobile-legends',
                userId: userId,
                zoneId: zone
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 8000
            }
        );
        if (r4.data && r4.data.username) {
            return {
                success: true,
                username: r4.data.username,
                user_id: userId,
                zone_id: zone
            };
        }
    } catch (e4) {}

    return {
        success: false,
        message: 'User ID tidak ditemukan. ' +
            'Cek kembali User ID: ' + userId +
            ' Zone ID: ' + zone
    };
}

async function cekFF(userId) {
    try {
        const r = await axios.post(
            'https://api.duniagames.co.id/api/' +
            'transaction/v1/top-up/inquiry/store',
            {
                productId: 1,
                paymentId: 1,
                itemId: 1,
                catalogId: 1,
                userId: userId,
                serverId: ''
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0',
                    'Origin':
                        'https://www.duniagames.co.id',
                    'Referer':
                        'https://www.duniagames.co.id/'
                },
                timeout: 8000
            }
        );
        if (r.data) {
            const nama = (r.data.data &&
                r.data.data.playerName) ||
                r.data.playerName || '';
            if (nama) return {
                success: true,
                username: nama,
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
    return {
        success: false,
        message: 'Cek PUBG belum tersedia'
    };
}

async function cekGenshin(userId, zoneId) {
    return {
        success: false,
        message: 'Cek Genshin belum tersedia'
    };
}

async function cekHonkai(userId, zoneId) {
    return {
        success: false,
        message: 'Cek Honkai belum tersedia'
    };
}

async function cekCOD(userId) {
    return {
        success: false,
        message: 'Cek COD belum tersedia'
    };
                }
