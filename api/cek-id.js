const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { game, user_id, zone_id } = req.query;

    if (!user_id) {
        return res.json({
            success: false,
            message: 'user_id wajib'
        });
    }

    const debugInfo = [];

    // Test 1: Codashop confirmPurchase ML
    try {
        const r1 = await axios.post(
            'https://order.codashop.com/mobileApp' +
            '/confirmPurchase',
            {
                voucherPricePoint: {
                    id: 44,
                    price: 14000,
                    variablePrice: 0
                },
                shopInfo: 'shop.codashop.com/id' +
                    '/mobile-legends',
                paymentChannelId: 0,
                userId: user_id,
                zoneId: zone_id || '',
                sessionId: '',
                voucherTypeName: 'MOBILE_LEGENDS'
            },
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 ' +
                        '(Linux; Android 12) ' +
                        'Chrome/112.0.0.0',
                    'Content-Type': 'application/json',
                    'Origin':
                        'https://shop.codashop.com',
                    'Referer':
                        'https://shop.codashop.com/' +
                        'id/mobile-legends'
                },
                timeout: 8000
            }
        );
        debugInfo.push({
            test: 'codashop_confirm',
            status: r1.status,
            data: r1.data
        });
    } catch (e) {
        debugInfo.push({
            test: 'codashop_confirm',
            error: e.message,
            status: e.response ?
                e.response.status : 'no_response',
            data: e.response ?
                e.response.data : null
        });
    }

    // Test 2: Codashop game info
    try {
        const r2 = await axios.get(
            'https://game.codashop.com/api/info' +
            '?userId=' + user_id +
            '&zoneId=' + (zone_id || '') +
            '&voucherPricePoint.id=44' +
            '&voucherPricePoint.price=14000' +
            '&voucherPricePoint.variablePrice=0' +
            '&shopInfo=shop.codashop.com' +
            '%2Fid%2Fmobile-legends',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 ' +
                        '(Linux; Android 12) ' +
                        'Chrome/112.0.0.0',
                    'Origin':
                        'https://shop.codashop.com',
                    'Referer':
                        'https://shop.codashop.com/' +
                        'id/mobile-legends'
                },
                timeout: 8000
            }
        );
        debugInfo.push({
            test: 'codashop_game_api',
            status: r2.status,
            data: r2.data
        });
    } catch (e) {
        debugInfo.push({
            test: 'codashop_game_api',
            error: e.message,
            status: e.response ?
                e.response.status : 'no_response',
            data: e.response ?
                e.response.data : null
        });
    }

    // Test 3: Dunia Games
    try {
        const r3 = await axios.post(
            'https://api.duniagames.co.id/api/' +
            'transaction/v1/top-up/inquiry/store',
            {
                productId: 1,
                userId: user_id,
                serverId: zone_id || '',
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
        debugInfo.push({
            test: 'dunia_games',
            status: r3.status,
            data: r3.data
        });
    } catch (e) {
        debugInfo.push({
            test: 'dunia_games',
            error: e.message,
            status: e.response ?
                e.response.status : 'no_response',
            data: e.response ?
                e.response.data : null
        });
    }

    // Test 4: VIP Games
    try {
        const r4 = await axios.post(
            'https://www.vipgames.id/api/v2/' +
            'check-user',
            {
                game: 'mobilelegend',
                userId: user_id,
                zoneId: zone_id || ''
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 8000
            }
        );
        debugInfo.push({
            test: 'vip_games',
            status: r4.status,
            data: r4.data
        });
    } catch (e) {
        debugInfo.push({
            test: 'vip_games',
            error: e.message,
            status: e.response ?
                e.response.status : 'no_response',
            data: e.response ?
                e.response.data : null
        });
    }

    return res.json({
        user_id: user_id,
        zone_id: zone_id || '',
        debug: debugInfo
    });
};
