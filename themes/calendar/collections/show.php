<?php
    $collectionTitle = strip_formatting(metadata('collection', array('Dublin Core', 'Title')));
    echo head(array('title'=> $collectionTitle, 'bodyclass' => 'collections show'));
?>
    <h1><?php echo $collectionTitle; ?></h1>
	<?php echo text_to_paragraphs(metadata('collection', array('Dublin Core', 'Description'), array('snippet'=>1250))); ?>


    <?php// echo all_element_texts('collection'); ?>

    <div id="collection-items">

	<?php 
		usort($items, function ($a, $b) {
			$dateString = metadata($a, array('Dublin Core', 'Date'));
			$dateA = DateTime::createFromFormat('Y-m-d G:i', $dateString);
			$dateString = metadata($b, array('Dublin Core', 'Date'));
			$dateB = DateTime::createFromFormat('Y-m-d G:i', $dateString);
			return ($dateA instanceOf DateTime) && ($dateB instanceOf DateTime) ? $dateB->format('U') > $dateA->format('U') : true;
		});
	?>
        <?php if (metadata('collection', 'total_items') > 0): ?>
            <?php foreach ($items as $item): ?>
            <?php $itemTitle = strip_formatting(metadata($item, array('Dublin Core', 'Title'))); ?>
            <div class="item hentry">
				<?php if ($item->Type->name == 'Sound'): ?>
					<h3>
						<?php 
							$dateString = metadata($item, array('Dublin Core', 'Date'));
							$date = DateTime::createFromFormat('Y-m-j G:i', $dateString);
							echo $date->format('j M Y G:i');
						?>
						<?php echo $itemTitle ? " - ${itemTitle}" : null; ?>
					</h3>
		
					<?php if (metadata($item, 'has thumbnail')): ?>
					<div class="item-img">
						<?php echo link_to_item(item_image('square_thumbnail', array('alt' => $itemTitle))); ?>
					</div>
					<?php endif; ?>

                    <?php echo files_for_item([], [], $item); ?>

					<?php if ($text = metadata($item, array('Item Type Metadata', 'Text'), array('snippet'=>250))): ?>
					<div class="item-description">
						<p><?php echo $text; ?></p>
					</div>
					<?php elseif ($description = metadata($item, array('Dublin Core', 'Description'), array('snippet'=>8250))): ?>
					<div class="item-description">
						<?php echo $description; ?>
					</div>
					<?php endif; ?>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p><?php echo __("There are currently no items within this collection."); ?></p>
        <?php endif; ?>
    </div><!-- end collection-items -->

<?php fire_plugin_hook('public_collections_show', array('view' => $this, 'collection' => $collection)); ?>
<?php echo foot(); ?>
