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
        return res.status(400).json({
            success: false,
            message: 'Parameter game dan user_id wajib'
        });
    }

    const gameNorm = game.toLowerCase().trim();
    let result = { success: false, username: '' };

    try {
        if (gameNorm.includes('mobile legend') ||
            gameNorm === 'ml' ||
            gameNorm === 'mlbb') {
            result = await cekMLBB(user_id, zone_id);
        } else if (gameNorm.includes('free fire') ||
            gameNorm === 'ff') {
            result = await cekFreeFire(user_id);
        } else if (gameNorm.includes('pubg')) {
            result = await cekPUBG(user_id);
        } else if (gameNorm.includes('genshin')) {
            result = await cekGenshin(user_id, zone_id);
        } else if (gameNorm.includes('honkai')) {
            result = await cekHonkai(user_id, zone_id);
        } else if (gameNorm.includes('call of duty') ||
            gameNorm.includes('cod')) {
            result = await cekCOD(user_id);
        } else {
            result = {
                success: false,
                message: 'Game ' + game +
                    ' belum didukung'
            };
        }
    } catch (e) {
        result = {
            success: false,
            message: e.message
        };
    }

    return res.status(200).json(result);
};

// Helper headers
function getHeaders(referer) {
    return {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; ' +
            'SM-G998B) AppleWebKit/537.36 (KHTML, ' +
            'like Gecko) Chrome/112.0.0.0 Mobile ' +
            'Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        'Origin': 'https://shop.codashop.com',
        'Referer': referer ||
            'https://shop.codashop.com/id/',
        'Content-Type': 'application/json'
    };
}

// ===== MOBILE LEGENDS =====
async function cekMLBB(userId, zoneId) {
    const zone = zoneId || '';

    // Coba endpoint 1: Codashop
    try {
        const resp = await axios.post(
            'https://order.codashop.com/mobileApp/' +
            'confirmPurchase',
            {
                voucherPricePoint: {
                    id: 44,
                    price: 14000,
                    variablePrice: 0
                },
                shopInfo:
                    'shop.codashop.com/id/mobile-legends',
                paymentChannelId: 0,
                userId: userId,
                zoneId: zone,
                sessionId: '',
                voucherTypeName: 'MOBILE_LEGENDS'
            },
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/mobile-legends'),
                timeout: 8000
            }
        );

        const d = resp.data;
        if (d && d.confirmationFields) {
            const nama = d.confirmationFields.username ||
                d.confirmationFields.heroname ||
                d.confirmationFields.name || '';
            if (nama) {
                return {
                    success: true,
                    username: nama,
                    user_id: userId,
                    zone_id: zone
                };
            }
        }
    } catch (e1) {}

    // Coba endpoint 2: Codashop game API
    try {
        const resp2 = await axios.get(
            'https://game.codashop.com/api/info?' +
            'userId=' + userId +
            '&zoneId=' + zone +
            '&voucherPricePoint.id=44' +
            '&voucherPricePoint.price=14000' +
            '&voucherPricePoint.variablePrice=0' +
            '&shopInfo=shop.codashop.com%2F' +
            'id%2Fmobile-legends',
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/mobile-legends'),
                timeout: 8000
            }
        );

        const d2 = resp2.data;
        if (d2 && d2.confirmationFields) {
            const nama2 =
                d2.confirmationFields.username ||
                d2.confirmationFields.name || '';
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

    // Coba endpoint 3: API alternatif
    try {
        const resp3 = await axios.post(
            'https://api.duniagames.co.id/api/' +
            'transaction/v1/top-up/inquiry/store',
            {
                productId: 1,
                userId: userId,
                serverId: zone,
                gameId: 'mobile-legends'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 8000
            }
        );
        if (resp3.data && resp3.data.data &&
            resp3.data.data.playerName) {
            return {
                success: true,
                username: resp3.data.data.playerName,
                user_id: userId,
                zone_id: zone
            };
        }
    } catch (e3) {}

    return {
        success: false,
        message: 'User ID tidak ditemukan. ' +
            'Pastikan User ID dan Zone ID benar.'
    };
}

// ===== FREE FIRE =====
async function cekFreeFire(userId) {
    try {
        const resp = await axios.post(
            'https://order.codashop.com/mobileApp/' +
            'confirmPurchase',
            {
                voucherPricePoint: {
                    id: 1,
                    price: 15000,
                    variablePrice: 0
                },
                shopInfo:
                    'shop.codashop.com/id/free-fire',
                paymentChannelId: 0,
                userId: userId,
                zoneId: '',
                sessionId: '',
                voucherTypeName: 'FREE_FIRE'
            },
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/free-fire'),
                timeout: 8000
            }
        );

        const d = resp.data;
        if (d && d.confirmationFields) {
            const nama =
                d.confirmationFields.username ||
                d.confirmationFields.name || '';
            if (nama) {
                return {
                    success: true,
                    username: nama,
                    user_id: userId
                };
            }
        }
    } catch (e) {}

    // Coba game API
    try {
        const resp2 = await axios.get(
            'https://game.codashop.com/api/info?' +
            'userId=' + userId +
            '&zoneId=' +
            '&voucherPricePoint.id=1' +
            '&voucherPricePoint.price=15000' +
            '&voucherPricePoint.variablePrice=0' +
            '&shopInfo=shop.codashop.com%2F' +
            'id%2Ffree-fire',
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/free-fire'),
                timeout: 8000
            }
        );
        const d2 = resp2.data;
        if (d2 && d2.confirmationFields) {
            const nama2 =
                d2.confirmationFields.username ||
                d2.confirmationFields.name || '';
            if (nama2) {
                return {
                    success: true,
                    username: nama2,
                    user_id: userId
                };
            }
        }
    } catch (e2) {}

    return {
        success: false,
        message: 'User ID Free Fire tidak ditemukan'
    };
}

// ===== PUBG MOBILE =====
async function cekPUBG(userId) {
    try {
        const resp = await axios.post(
            'https://order.codashop.com/mobileApp/' +
            'confirmPurchase',
            {
                voucherPricePoint: {
                    id: 1,
                    price: 15000,
                    variablePrice: 0
                },
                shopInfo:
                    'shop.codashop.com/id/pubg-mobile',
                paymentChannelId: 0,
                userId: userId,
                zoneId: '',
                sessionId: '',
                voucherTypeName: 'PUBG_MOBILE'
            },
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/pubg-mobile'),
                timeout: 8000
            }
        );
        const d = resp.data;
        if (d && d.confirmationFields) {
            const nama =
                d.confirmationFields.username ||
                d.confirmationFields.name || '';
            if (nama) {
                return {
                    success: true,
                    username: nama,
                    user_id: userId
                };
            }
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID PUBG tidak ditemukan'
    };
}

// ===== GENSHIN IMPACT =====
async function cekGenshin(userId, zoneId) {
    const zone = zoneId || 'os_asia';
    try {
        const resp = await axios.post(
            'https://order.codashop.com/mobileApp/' +
            'confirmPurchase',
            {
                voucherPricePoint: {
                    id: 1,
                    price: 15000,
                    variablePrice: 0
                },
                shopInfo:
                    'shop.codashop.com/id/genshin-impact',
                paymentChannelId: 0,
                userId: userId,
                zoneId: zone,
                sessionId: '',
                voucherTypeName: 'GENSHIN_IMPACT'
            },
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/genshin-impact'),
                timeout: 8000
            }
        );
        const d = resp.data;
        if (d && d.confirmationFields) {
            const nama =
                d.confirmationFields.username ||
                d.confirmationFields.name || '';
            if (nama) {
                return {
                    success: true,
                    username: nama,
                    user_id: userId,
                    zone_id: zone
                };
            }
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID Genshin tidak ditemukan'
    };
}

// ===== HONKAI STAR RAIL =====
async function cekHonkai(userId, zoneId) {
    const zone = zoneId || 'prod_official_asia';
    try {
        const resp = await axios.post(
            'https://order.codashop.com/mobileApp/' +
            'confirmPurchase',
            {
                voucherPricePoint: {
                    id: 1,
                    price: 15000,
                    variablePrice: 0
                },
                shopInfo:
                    'shop.codashop.com/id/honkai-star-rail',
                paymentChannelId: 0,
                userId: userId,
                zoneId: zone,
                sessionId: '',
                voucherTypeName: 'HONKAI_STAR_RAIL'
            },
            {
                headers: getHeaders(
                    'https://shop.codashop.com/' +
                    'id/honkai-star-rail'),
                timeout: 8000
            }
        );
        const d = resp.data;
        if (d && d.confirmationFields) {
            const nama =
                d.confirmationFields.username ||
                d.confirmationFields.name || '';
            if (nama) {
                return {
                    success: true,
                    username: nama,
                    user_id: userId,
                    zone_id: zone
                };
            }
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID Honkai tidak ditemukan'
    };
}

// ===== CALL OF DUTY =====
async function cekCOD(userId) {
    try {
        const resp = await axios.post(
            'https://order.codashop.com/mobileApp/' +
            'confirmPurchase',
            {
                voucherPricePoint: {
                    id: 1,
                    price: 15000,
                    variablePrice: 0
                },
                shopInfo:
                    'shop.codashop.com/id/' +
                    'call-of-duty-mobile',
                paymentChannelId: 0,
                userId: userId,
                zoneId: '',
                sessionId: '',
                voucherTypeName: 'CALL_OF_DUTY_MOBILE'
            },
            {
                headers: getHeaders(
                    'https://shop.codashop.com/id/' +
                    'call-of-duty-mobile'),
                timeout: 8000
            }
        );
        const d = resp.data;
        if (d && d.confirmationFields) {
            const nama =
                d.confirmationFields.username ||
                d.confirmationFields.name || '';
            if (nama) {
                return {
                    success: true,
                    username: nama,
                    user_id: userId
                };
            }
        }
    } catch (e) {}

    return {
        success: false,
        message: 'User ID COD tidak ditemukan'
    };
}
