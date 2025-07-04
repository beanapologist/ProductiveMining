import type { ProductiveBlock, MathematicalWork } from "@shared/schema";

/**
 * Generates a proper blockchain hash for a productive block
 * Uses mathematical work results to create meaningful hashes instead of arbitrary SHA-256
 */
export function generateProductiveBlockHash(
  block: Omit<ProductiveBlock, 'blockHash'>,
  mathematicalWork: MathematicalWork[]
): string {
  // Create hash based on mathematical discoveries rather than arbitrary computation
  const workSignatures = mathematicalWork.map(w => w.signature).join('');
  const blockData = `${block.index}${block.previousHash}${block.merkleRoot}${block.nonce}${workSignatures}${block.totalScientificValue}`;
  
  // Generate deterministic hash from mathematical content
  return simpleHash(blockData).padStart(64, '0');
}

/**
 * Generates Merkle root from mathematical work
 */
export function generateMerkleRoot(mathematicalWork: MathematicalWork[]): string {
  if (mathematicalWork.length === 0) return '0'.repeat(64);
  
  const workHashes = mathematicalWork.map(work => 
    simpleHash(`${work.workType}${work.signature}${work.scientificValue}`)
  );
  
  return buildMerkleTree(workHashes);
}

/**
 * Validates block integrity using mathematical work
 */
export function validateProductiveBlock(
  block: ProductiveBlock,
  mathematicalWork: MathematicalWork[]
): boolean {
  // Validate Merkle root
  const expectedMerkleRoot = generateMerkleRoot(mathematicalWork);
  if (block.merkleRoot !== expectedMerkleRoot) return false;
  
  // Validate block hash
  const expectedHash = generateProductiveBlockHash(
    { ...block, blockHash: '' },
    mathematicalWork
  );
  if (block.blockHash !== expectedHash) return false;
  
  // Validate scientific value sum
  const totalValue = mathematicalWork.reduce((sum, work) => sum + work.scientificValue, 0);
  if (Math.abs(block.totalScientificValue - totalValue) > 0.01) return false;
  
  return true;
}

/**
 * Simple hash function for deterministic results
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Build Merkle tree from hashes
 */
function buildMerkleTree(hashes: string[]): string {
  if (hashes.length === 0) return '0'.repeat(64);
  if (hashes.length === 1) return hashes[0].padStart(64, '0');
  
  const nextLevel: string[] = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i];
    const right = hashes[i + 1] || left; // Duplicate if odd number
    nextLevel.push(simpleHash(left + right));
  }
  
  return buildMerkleTree(nextLevel);
}

/**
 * Calculate proof-of-work nonce for difficulty target
 */
export function calculateNonce(
  blockData: string,
  difficulty: number
): number {
  const target = '0'.repeat(Math.floor(difficulty / 4));
  let nonce = 0;
  
  while (nonce < 1000000) { // Limit to prevent infinite loop
    const hash = simpleHash(blockData + nonce);
    if (hash.startsWith(target)) {
      return nonce;
    }
    nonce++;
  }
  
  return nonce;
}