<template>
	<div>
		<v-wait for='api'>
			<template slot="waiting">
        			<img src='@/assets/5.gif' style='position: absolute;top: 50%;left: 50%;margin-right:-50%;transform: translate(-50%, -50%)'/>
    		</template>
		</v-wait>
		<!--<h2 class='md-title'>Primary Spotify Account</h2>
		<div class='md-subhead' style='overflow-wrap:break-word'>This is the account that will be used for music streaming</div>
		<div v-if='tokenExists===true'>
			<md-card class='spotifyCard'>
      		<md-card-header>
       			<md-card-header-text>
         			<div class="md-title">{{primary_user}}</div>
      				<div class="md-subhead">{{primary_type}}</div>
					</md-card-header-text>

					<md-card-media>
						<img src="@/assets/spotifyLogo.png" alt="Spotify">
        			</md-card-media>
      		</md-card-header>

      		<md-card-actions>
      			<md-button @click='deleteToken()'>Unlink</md-button>
      		</md-card-actions>
			</md-card>
		</div>

		<div v-if='tokenExists===false'>
			<md-card class='spotifyCard'>
   			<md-card-header>
					<md-card-header-text>
      				<div class="md-title">No Primary Account</div>
						<div class="md-subhead">Link a new account</div>
      			</md-card-header-text>
 					
					<md-card-media>
   					<img src="@/assets/spotifyLogo.png" alt="Spotify">
   				</md-card-media>
      		</md-card-header>

      		<md-card-actions>
        			<md-button @click='linkAccount()'>Link Account</md-button>
      		</md-card-actions>
   		</md-card>
		</div>-->
	</div>
</template>

<script>
import SpotifyService from '@/services/SpotifyService';

export default {
	name: 'SystemSettings',
	props: {
		token: String
	},
	data() {
		return {
		}
	},
	created() {
		this.getAccount();
	},
	methods: {
	async getAccount() {
      const profileResponse = await SpotifyService.getProfile(this.token);
			this.primary_user = profileResponse.data.name;
			this.primary_type = profileResponse.data.type;
			this.primary_type = this.primary_type.charAt(0).toUpperCase() + this.primary_type.slice(1);
		},
	}
}
</script>

<style scoped>
	
</style>
