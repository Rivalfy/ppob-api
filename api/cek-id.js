const axios = require('axios');

module.exports = async (req, res) => {
    // Allow CORS
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
            message: 'Parameter game dan user_id wajib diisi'
        });
    }

    try {
        let username = '';
        let gameNorm = game.toLowerCase().trim();

        if (gameNorm.includes('mobile legend') ||
            gameNorm === 'ml' ||
            gameNorm === 'mlbb') {
            username = await cekML(user_id, zone_id);
        } else if (gameNorm.includes('free fire') ||
            gameNorm === 'ff') {
            username = await cekFF(user_id);
        } else if (gameNorm.includes('pubg') ||
            gameNorm.includes('pubg mobile')) {
            username = await cekPUBG(user_id);
        } else if (gameNorm.includes('genshin')) {
            username = await cekGenshin(
                user_id, zone_id);
        } else {
            return res.status(200).json({
                success: false,
                message: 'Game belum didukung'
            });
        }

        if (username) {
            return res.status(200).json({
                success: true,
                username: username,
                user_id: user_id,
                zone_id: zone_id || ''
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'User ID tidak ditemukan'
            });
        }

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'Gagal cek ID: ' + error.message
        });
    }
};

// Cek Mobile Legends
async function cekML(userId, zoneId) {
    try {
        const response = await axios.get(
            `https://game.codashop.com/api/info` +
            `?userId=${userId}&zoneId=${zoneId || ''}` +
            `&voucherPricePoint.id=1` +
            `&voucherPricePoint.price=1` +
            `&voucherPricePoint.variablePrice=0` +
            `&shopInfo=shop.codashop.com/id/mobile-legends`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://shop.codashop.com'
                },
                timeout: 8000
            }
        );
        if (response.data &&
            response.data.confirmationFields) {
            return response.data
                .confirmationFields.username ||
                response.data.confirmationFields.name ||
                '';
        }
        return '';
    } catch (e) {
        // Coba endpoint alternatif
        try {
            const r2 = await axios.post(
                'https://order.codashop.com/mobileApp' +
                '/confirmPurchase',
                {
                    voucherPricePoint: {
                        id: 1, price: 1,
                        variablePrice: 0
                    },
                    shopInfo:
                        'shop.codashop.com/id/' +
                        'mobile-legends',
                    userId: userId,
                    zoneId: zoneId || ''
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    },
                    timeout: 8000
                }
            );
            if (r2.data &&
                r2.data.confirmationFields) {
                return r2.data
                    .confirmationFields.username || '';
            }
        } catch (e2) {}
        return '';
    }
}

// Cek Free Fire
async function cekFF(userId) {
    try {
        const response = await axios.get(
            `https://game.codashop.com/api/info` +
            `?userId=${userId}` +
            `&voucherPricePoint.id=1` +
            `&voucherPricePoint.price=1` +
            `&voucherPricePoint.variablePrice=0` +
            `&shopInfo=shop.codashop.com/id/free-fire`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://shop.codashop.com'
                },
                timeout: 8000
            }
        );
        if (response.data &&
            response.data.confirmationFields) {
            return response.data
                .confirmationFields.username ||
                response.data.confirmationFields.name ||
                '';
        }
        return '';
    } catch (e) {
        return '';
    }
}

// Cek PUBG Mobile
async function cekPUBG(userId) {
    try {
        const response = await axios.get(
            `https://game.codashop.com/api/info` +
            `?userId=${userId}` +
            `&voucherPricePoint.id=1` +
            `&voucherPricePoint.price=1` +
            `&voucherPricePoint.variablePrice=0` +
            `&shopInfo=shop.codashop.com/id/pubg-mobile`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://shop.codashop.com'
                },
                timeout: 8000
            }
        );
        if (response.data &&
            response.data.confirmationFields) {
            return response.data
                .confirmationFields.username ||
                response.data.confirmationFields.name ||
                '';
        }
        return '';
    } catch (e) {
        return '';
    }
}

// Cek Genshin Impact
async function cekGenshin(userId, zoneId) {
    try {
        const response = await axios.get(
            `https://game.codashop.com/api/info` +
            `?userId=${userId}&zoneId=${zoneId || ''}` +
            `&voucherPricePoint.id=1` +
            `&voucherPricePoint.price=1` +
            `&voucherPricePoint.variablePrice=0` +
            `&shopInfo=shop.codashop.com/id/genshin-impact`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://shop.codashop.com'
                },
                timeout: 8000
            }
        );
        if (response.data &&
            response.data.confirmationFields) {
            return response.data
                .confirmationFields.username ||
                response.data.confirmationFields.name ||
                '';
        }
        return '';
    } catch (e) {
        return '';
    }
}
