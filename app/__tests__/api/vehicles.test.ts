import { GET } from '@/app/api/vehicles/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    vehicle: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/vehicles', () => {
  it('returns available vehicles', async () => {
    const mockVehicles = [
      { id: '1', model: 'Solo', status: 'Available' },
    ];
    (prisma.vehicle.findMany as jest.Mock).mockResolvedValue(mockVehicles)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.vehicles).toEqual(mockVehicles)
  })

  it('handles errors', async () => {
    (prisma.vehicle.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })
})
