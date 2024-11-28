import { Flex, Grid } from "@chakra-ui/react";
import GameCard from "../components/GameCard";

const Games = () => {
    return (
        <Flex py='96px' justify='center'>
            <Grid templateColumns={{ base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' }} gap='24px'>
                <GameCard src="/cryptales.png" label="CRYPTALES" to='/cryptales.html' />
                <GameCard src="/pump_dump.png" label="PUMP&DUMP" to='/pump.html' />
                <GameCard src="/lumara_drip.png" label="LUMARA DRIP" to='/lumara.html' />
                <GameCard src="/digitus_maximus.png" label="DIGITUS MAXIMUS" to='/digitus_maximus.html' />
                <GameCard src="/coming_soon.png" label="COMING SOON" />
                <GameCard src="/coming_soon.png" label="COMING SOON" />
                <GameCard src="/coming_soon.png" label="COMING SOON" />
                <GameCard src="/coming_soon.png" label="COMING SOON" />
            </Grid>
        </Flex>
    )
}

export default Games;