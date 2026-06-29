export default function getReferralsValue(referralsValue: number) {
    let endWord = ''

    if (referralsValue == 1) endWord = 'реферал'
    if (referralsValue > 1 && referralsValue < 5) endWord = 'реферала'
    if (referralsValue == 0 || referralsValue > 4) endWord = 'рефералов'

    return referralsValue + ' ' + endWord
}