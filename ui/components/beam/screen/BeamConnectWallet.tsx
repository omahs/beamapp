import React, { useEffect, useState } from "react"

import Head from "next/head"

import { useNavigate } from "react-router-dom"

import {
  Button,
  HStack,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react"

import { ConnectWalletIcon, WalletIcon } from "../../../icon"
import { BeamActionButton } from "../common/BeamActionButton"

import { BeamSelectWalletModal } from "../auth/BeamSelectWalletModal"

import { showToast } from "../../../utils/toast"

import { createPlugLogin } from "../../auth/provider/plug"
import { PlugConfig } from "../../../config/beamconfig"

const ActionButton = ({ children, ...others }) => {
  return (
    <BeamActionButton w={{ base: "200px", md: "223px" }} h="52px" {...others}>
      {children}
    </BeamActionButton>
  )
}

export const BeamConnetWallet = ({ setBgColor, setHashtags }) => {
  const initLoading = 1
  const toast = useToast()

  useEffect(() => {
    setBgColor("beam_blue")
    setHashtags([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initLoading])

  const navigate = useNavigate()

  const navigateToMyBeams = () => {
    navigate("/mybeams")
  }

  const {
    isOpen: isSelectAuthOpen,
    onOpen: onSelectAuthOpen,
    onClose: onSelectAuthClose
  } = useDisclosure()
  const [isLoading, setLoading] = useState(false)

  const cancelLogin = () => {
    setLoading(false)
  }

  const handleAuthUpdate = identity => {
    if (identity == null) {
      showToast(
        toast,
        "Connect Wallet",
        "We have a problem connecting your Wallet. Please try again later.",
        "error"
      )
      return
    }

    showToast(
      toast,
      "Connect Wallet",
      "Your Wallet is connected successfully.",
      "success"
    )
    navigateToMyBeams()
  }

  const selectAuth = async authProvider => {
    onSelectAuthClose()

    const authLogin = createPlugLogin(
      handleAuthUpdate,
      authProvider,
      PlugConfig.whitelist
    )

    showToast(
      toast,
      "Login with Plug",
      "Please make sure your have unlocked your Plug Wallet.",
      "info"
    )

    setLoading(true)
    await authLogin()
  }

  return (
    <VStack
      spacing={{ base: "10px", md: "12px" }}
      align="center"
      w="100%"
      h="100vh"
      color="dark_black"
      fontSize="16px"
      pb="260px"
      justifyContent="center"
    >
      <Head>
        <title>Connect Wallet - Beam</title>
      </Head>
      <ConnectWalletIcon
        w={{ base: "280px", md: "436px" }}
        h={{ base: "106px", md: "165px" }}
      />
      <VStack
        py="27px"
        align="center"
        w="385px"
        px={{ base: "24px", md: "0px" }}
      >
        <Text>
          Connect your wallet to view your active Beams and create new ones.
        </Text>
      </VStack>

      <HStack spacing="37px" justify="center">
        <ActionButton
          leftIcon={<WalletIcon w="23px" h="23px" color="black_5" />}
          onClick={onSelectAuthOpen}
        >
          Connect Wallet
        </ActionButton>
        <BeamSelectWalletModal
          isOpen={isSelectAuthOpen}
          onClose={onSelectAuthClose}
          selectAuth={selectAuth}
        />
        {isLoading && (
          <Button
            w="110px"
            h="38px"
            color="blue_1"
            variant="link"
            textAlign="center"
            onClick={cancelLogin}
          >
            Cancel
          </Button>
        )}
      </HStack>
    </VStack>
  )
}
