module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { game, user_id, zone_id } = req.query;

    if (!user_id) {
        return res.json({
            success: false,
            message: 'User ID wajib diisi'
        });
    }

    const gameNorm = (game || '').toLowerCase();
    const zone = zone_id || '';

    // Validasi format ID berdasarkan game
    let valid = false;
    let pesanError = '';

    if (gameNorm.includes('mobile legend') ||
        gameNorm === 'ml') {
        // ML: user ID 8-12 digit, zone ID 4-7 digit
        if (!/^\d{6,12}$/.test(user_id)) {
            pesanError = 'User ID ML harus 6-12 angka';
        } else if (zone && !/^\d{1,8}$/.test(zone)) {
            pesanError = 'Zone ID ML harus angka';
        } else {
            valid = true;
        }
    } else if (gameNorm.includes('free fire') ||
        gameNorm === 'ff') {
        // FF: 9-10 digit
        if (!/^\d{9,10}$/.test(user_id)) {
            pesanError =
                'User ID Free Fire harus 9-10 angka';
        } else {
            valid = true;
        }
    } else if (gameNorm.includes('pubg')) {
        if (!/^\d{6,12}$/.test(user_id)) {
            pesanError = 'User ID PUBG harus 6-12 angka';
        } else {
            valid = true;
        }
    } else if (gameNorm.includes('genshin')) {
        if (!/^\d{8,10}$/.test(user_id)) {
            pesanError =
                'User ID Genshin harus 8-10 angka';
        } else {
            valid = true;
        }
    } else {
        // Game lain: minimal 4 digit
        if (!/^\d{4,}$/.test(user_id)) {
            pesanError =
                'User ID harus minimal 4 angka';
        } else {
            valid = true;
        }
    }

    if (!valid) {
        return res.json({
            success: false,
            message: pesanError
        });
    }

    // Format valid - return success
    // username tidak bisa dicek tanpa akses API resmi
    return res.json({
        success: true,
        username: 'ID: ' + user_id +
            (zone ? ' | Zone: ' + zone : ''),
        user_id: user_id,
        zone_id: zone,
        note: 'Format ID valid. ' +
            'Pastikan ID benar sebelum transaksi.'
    });
};
