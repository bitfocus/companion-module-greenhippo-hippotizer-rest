exports.parseBankSlot = function (bank, slot) {
    // convert to a single integer media ID
    const mediaID = (bank * 256) + slot
    return mediaID
}