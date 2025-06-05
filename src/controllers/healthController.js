/**
 * @openapi
 * /health:
 *   get:
 *     summary: Application health check
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Healthy
 */
export const healthCheck = async (req, res) => {
    res.status(200).json({ data: { message: 'Vaultify is running correctly' } });
};
