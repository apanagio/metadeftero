<?php
    $pageTitle = __('Browse collections');
    echo head(array('bodyclass' => 'collections browse'));
?>

<!--
    <h1>Εκπομπές</h1>
-->
    
    <div class="browse-collections">
        <?php if ($total_results > 0): ?>

			<?php $i = 0; ?>	
            <?php foreach (loop('collections') as $collection): ?>
				<?php $i += 1; ?>	
                <div class="collection col-md-4">                    
					<div>
						<?php 
							$title = metadata('collection', array('Dublin Core', 'Title'));
							echo link_to_collection(); 
							//~ echo link_to_items_browse($title, array('collection' => $collection->id)); 
						?>
					</div>
					<?php if ($collectionImage = record_image('collection', 'square_thumbnail', array('class' => 'img-circle'))): ?>
						<div>
							<?php 
								echo link_to_collection($collectionImage, array('class' => 'image')); 
								//echo link_to_items_browse($collectionImage, array('collection' => $collection->id)); 
							?>
						</div>
					<?php endif; ?>
					<?php if (metadata('collection', array('Dublin Core', 'Creator'))): ?>
						<div>
							<?php echo metadata('collection', array('Dublin Core', 'Creator'), array('all'=>true, 'delimiter'=>', ')); ?>
						</div>
					<?php endif; ?>
					<?php if (metadata('collection', array('Dublin Core', 'Description'))): ?>
						<div>
							<?php echo text_to_paragraphs(metadata('collection', array('Dublin Core', 'Description'), array('snippet'=>150))); ?>
						</div>
					<?php endif; ?>
			
				<?php fire_plugin_hook('public_items_browse_each', array('view' => $this, 'collection' => $collection)); ?>
                </div>
            <?php endforeach; ?>
        <?php else : ?>
            <p><?php echo 'No collections added, yet.'; ?></p>
        <?php endif; ?>
    </div>
    <?php echo pagination_links(); ?>        

<?php fire_plugin_hook('public_collections_browse', array('collections'=> $collections, 'view' => $this)); ?>
<?php echo foot(); ?>
