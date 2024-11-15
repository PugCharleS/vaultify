export const healthCheck = async (req, res) => {
    res.status(200).json({ data: { message: 'Vaultify is running correctly' } });
};