import { useAccount } from 'wagmi';
import { type TransactionLike } from 'ethers';
import { useShield3Context, SimulateResponse } from '@shield3/react-sdk';
import { useState, useEffect, useMemo } from 'react';
import { Abi, encodeFunctionData } from 'viem';
import { UseContractReturn } from '@/hooks/contracts';

/**
 * Utility to see if a transaction should be allowed to proceed
 *
 * @param address address of user sending transaction
 * @param transaction transaction request
 * @returns {SimulateResponse | undefined}
 */
export function useAddressPolicyResults(address: `0x${string}`, transaction: TransactionLike) {
  const { shield3Client } = useShield3Context();
  const [policyResults, setPolicyResults] = useState<SimulateResponse | undefined>(undefined);

  // Memoize transaction to prevent unnecessary re-creations
  const stableTransaction = useMemo(() => transaction, [transaction.to, transaction.chainId, transaction.data, transaction.value, transaction.nonce, transaction.gasLimit]);

  useEffect(() => {
    const fetchPolicyResults = async () => {
      const results = await shield3Client.getPolicyResults(stableTransaction, address);
      setPolicyResults(results);
    };

    fetchPolicyResults();
  }, [address, stableTransaction, shield3Client]); // Use stableTransaction here

  return policyResults;
}

/**
 * Utility to see if a transaction should be allowed to proceed
 *
 * @param address address of user sending transaction
 * @param parameters contract call parameters
 * @returns {SimulateResponse | undefined}
 */
export function useAddressPolicyResultsContract(parameters: {
  address: `0x${string}`;
  chainId: number;
  to: `0x${string}`;
  contract: UseContractReturn<Abi>;
  functionName: string;
  args: (number | string)[];
  value: bigint;
}) {
  const functionData = encodeFunctionData({
    abi: parameters.contract.abi,
    functionName: parameters.functionName,
    args: parameters.args,
  });

  const transaction: TransactionLike = {
    to: parameters.to,
    chainId: parameters.chainId,
    data: functionData,
    value: parameters.value,
    nonce: 0, // TODO fix
    gasLimit: 0, // TODO fix
  };

  return useAddressPolicyResults(parameters.address, transaction);
}

/**
 * Utility to see if current user sending transaction should be allowed to proceed
 *
 * @param transaction transaction request
 * @returns {boolean}
 */
export function useLoggedInUserPolicyResults(transaction: TransactionLike) {
  const account = useAccount();

  return useAddressPolicyResults(account.address as `0x${string}`, transaction);
}

/**
 * Utility to see if a transaction should be allowed to proceed
 *
 * @param parameters contract call parameters
 * @returns {SimulateResponse | undefined}
 */
export function useLoggedInUserPolicyResultsContract(parameters: {
  contract: UseContractReturn<Abi>;
  to: string | undefined;
  functionName: string;
  args: (number | string)[];
  value: bigint;
}) {
  const account = useAccount();
  

  if (!account.address) {
    return undefined;
  }
  if (!account.chainId) {
    return undefined;
  }
  if (!parameters.to) {
    return undefined;
  }

  return useAddressPolicyResultsContract({
    address: account.address as `0x${string}`,
    chainId: account.chainId,
    to: parameters.to as `0x${string}`,
    contract: parameters.contract,
    functionName: parameters.functionName,
    args: parameters.args,
    value: parameters.value,
  });
}
