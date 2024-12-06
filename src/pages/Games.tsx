import { Flex, Grid } from "@chakra-ui/react";
import { useGetGames } from "../api/games";
import GameCard from "../components/GameCard";
import { IGame } from "../interfaces";

const Games = () => {
    const { games } = useGetGames();

    return (
        <Flex p={{ base: '16px', lg: '96px' }} justify='center'>
            <Grid w='full' maxW='1024px' templateColumns={{ base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' }} gap='24px'>
                {games.map((game: IGame) => {
                    return <GameCard key={game.id} src={`/games/${game.sname}.png`} label={game.name} to={`/games/${game.sname}.html`} />
                })}
                {Array.from({ length: 8 - games.length }, (_, index) => (
                    <GameCard key={index} src="/games/coming_soon.png" label="COMING SOON" />
                ))}
            </Grid>
        </Flex>
    )
}

export default Games;
