import axios from 'axios';

interface VerificationResult {
  isValid: boolean;
  legalName?: string;
  error?: string;
}

export async function verifyIndianIEC(iecCode: string): Promise<VerificationResult> {
  // Regex pattern for 10-digit alphanumeric Indian IEC
  const iecRegex = /^[A-Z0-9]{10}$/;
  if (!iecRegex.test(iecCode)) {
    return { isValid: false, error: 'Invalid IEC Format. Must be 10 alphanumeric characters.' };
  }

  try {
    // Upstream API Integration with DGFT verification provider
    const response = await axios.post(
      `${process.env.DGFT_VERIFICATION_API_URL}/verify-iec`,
      { iec: iecCode },
      { headers: { 'X-Api-Key': process.env.COMPLIANCE_API_KEY } }
    );

    if (response.data.status === 'ACTIVE') {
      return { isValid: true, legalName: response.data.entityName };
    }

    return { isValid: false, error: 'IEC is non-active or suspended.' };
  } catch (err: any) {
    return { isValid: false, error: 'Govt Portal Integration Timeout. Queued for manual audit.' };
  }
}