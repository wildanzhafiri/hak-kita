import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { POST } from './route';

vi.mock('@/server/admin-access', () => ({ getRadarAdminId: vi.fn() }));

vi.mock('@/server/admin-programs', () => ({
  ADMIN_PROGRAM_ERRORS: {
    alreadyExists: 'PROGRAM_ALREADY_EXISTS',
    unavailable: 'PROGRAM_STORAGE_UNAVAILABLE',
  },
  createProgramRecord: vi.fn(),
  validateAdminProgram: vi.fn(),
}));

import { getRadarAdminId } from '@/server/admin-access';
import { createProgramRecord, validateAdminProgram } from '@/server/admin-programs';

const mockedGetAdminId = vi.mocked(getRadarAdminId);
const mockedCreateProgram = vi.mocked(createProgramRecord);
const mockedValidateProgram = vi.mocked(validateAdminProgram);

function createRequest(body: string, origin = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000/api/admin/programs', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body,
  });
}

describe('create admin program route', () => {
  beforeEach(() => {
    mockedGetAdminId.mockReset();
    mockedCreateProgram.mockReset();
    mockedValidateProgram.mockReset();
    mockedGetAdminId.mockResolvedValue('admin-id');
    mockedValidateProgram.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects requests without an admin session', async () => {
    mockedGetAdminId.mockResolvedValue(null);

    const response = await POST(createRequest(JSON.stringify(makeProgram())));

    expect(response.status).toBe(403);
    expect(mockedCreateProgram).not.toHaveBeenCalled();
  });

  it('rejects requests from a different origin', async () => {
    const response = await POST(createRequest(JSON.stringify(makeProgram()), 'https://other.test'));

    expect(response.status).toBe(403);
    expect(mockedCreateProgram).not.toHaveBeenCalled();
  });

  it('validates the program before writing it', async () => {
    mockedValidateProgram.mockResolvedValue('Sumber utama harus berdomain .go.id');

    const response = await POST(createRequest(JSON.stringify(makeProgram())));

    expect(response.status).toBe(400);
    expect(mockedCreateProgram).not.toHaveBeenCalled();
  });

  it('creates a schema-valid program after all checks pass', async () => {
    const program = makeProgram();

    const response = await POST(createRequest(JSON.stringify(program)));

    expect(response.status).toBe(201);
    expect(mockedCreateProgram).toHaveBeenCalledWith(program);
  });
});
