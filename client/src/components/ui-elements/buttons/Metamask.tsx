"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  className?: string;
  onConnect?: (address: string) => void;
  disabled?: boolean;
}

const Metamask = ({ className, onConnect, disabled }: Props) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];

      if (onConnect) {
        onConnect(address);
      }

      toast.success("Wallet connected successfully!");
    } catch (error: any) {
      console.error("Error connecting wallet:", error);

      if (error.code === 4001) {
        toast.error("Connection request rejected");
      } else {
        toast.error("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      type="button"
      className={`
        relative flex items-center gap-3 px-4 py-2.5 rounded-md
        text-muted-foreground font-medium shadow-md bg-gray-50
        transition-all duration-200 ease-in-out
        hover:bg-inherit hover:opacity-100   
        ${
          disabled || isConnecting
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${className || ""}
      `}
      onClick={connectWallet}
      disabled={disabled || isConnecting}
    >
      <span className="relative flex gap-4 text-center z-10 text-sm sm:text-base font-semibold tracking-wide">
        {isConnecting ? "Connecting..." : "Connect to Metamask"}
        <Image
          src="/images/Metamask.png"
          alt="Metamask Icon"
          width={24}
          height={24}
          className="relative z-10"
        />
      </span>
    </Button>
  );
};

export default Metamask;
