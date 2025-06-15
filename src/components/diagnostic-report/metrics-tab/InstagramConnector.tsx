
import React from "react";
import InstagramIntegration from "@/components/instagram/InstagramIntegration";

interface InstagramConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const InstagramConnector: React.FC<InstagramConnectorProps> = ({ onConnectionChange }) => (
  <InstagramIntegration onConnectionChange={onConnectionChange} />
);

export default InstagramConnector;
